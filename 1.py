import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext
import subprocess
import os
import threading

WORK_DIR = os.path.dirname(os.path.abspath(__file__))
REMOTE_NAME = "origin"
BRANCH = "main"


class GitSyncApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Git 同步工具")
        self.root.geometry("680x520")
        self.root.resizable(False, False)

        self._build_ui()
        self._check_git_status()

    def _build_ui(self):
        top = ttk.LabelFrame(self.root, text="仓库信息", padding=10)
        top.pack(fill="x", padx=12, pady=(12, 4))

        ttk.Label(top, text="远程仓库地址:").grid(row=0, column=0, sticky="w")
        self.remote_var = tk.StringVar()
        self.remote_entry = ttk.Entry(top, textvariable=self.remote_var, width=60)
        self.remote_entry.grid(row=0, column=1, padx=(6, 0), sticky="ew")

        self.remote_btn = ttk.Button(top, text="设置远程仓库", command=self._set_remote)
        self.remote_btn.grid(row=0, column=2, padx=(6, 0))

        self.status_var = tk.StringVar(value="检测中...")
        ttk.Label(top, textvariable=self.status_var, foreground="gray").grid(
            row=1, column=0, columnspan=3, sticky="w", pady=(6, 0)
        )

        top.columnconfigure(1, weight=1)

        mid = ttk.LabelFrame(self.root, text="操作", padding=10)
        mid.pack(fill="x", padx=12, pady=4)

        btn_frame = ttk.Frame(mid)
        btn_frame.pack(fill="x")

        self.commit_label = ttk.Label(btn_frame, text="提交信息:")
        self.commit_label.pack(side="left")
        self.commit_var = tk.StringVar()
        self.commit_entry = ttk.Entry(btn_frame, textvariable=self.commit_var, width=36)
        self.commit_entry.pack(side="left", padx=(4, 0))
        self.commit_entry.insert(0, "update")

        self.push_btn = ttk.Button(btn_frame, text="⬆ 上传到 main", command=self._push)
        self.push_btn.pack(side="right", padx=(4, 0))

        self.pull_btn = ttk.Button(btn_frame, text="⬇ 从 main 拉取", command=self._pull)
        self.pull_btn.pack(side="right")

        log_frame = ttk.LabelFrame(self.root, text="日志", padding=6)
        log_frame.pack(fill="both", expand=True, padx=12, pady=(4, 12))

        self.log = scrolledtext.ScrolledText(log_frame, height=14, state="disabled", font=("Consolas", 9))
        self.log.pack(fill="both", expand=True)

    def _log(self, text):
        self.log.configure(state="normal")
        self.log.insert("end", text + "\n")
        self.log.see("end")
        self.log.configure(state="disabled")

    def _run(self, cmd):
        self._log(f"> {cmd}")
        try:
            result = subprocess.run(
                cmd, shell=True, cwd=WORK_DIR,
                capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=120
            )
            if result.stdout.strip():
                self._log(result.stdout.strip())
            if result.returncode != 0 and result.stderr.strip():
                self._log(f"[错误] {result.stderr.strip()}")
            return result.returncode == 0
        except subprocess.TimeoutExpired:
            self._log("[错误] 命令超时")
            return False
        except Exception as e:
            self._log(f"[错误] {e}")
            return False

    def _check_git_status(self):
        git_dir = os.path.join(WORK_DIR, ".git")
        if not os.path.isdir(git_dir):
            self.status_var.set("当前目录未初始化 Git，正在初始化...")
            self._run("git init")
            self._run(f"git checkout -B {BRANCH}")
            self.status_var.set(f"Git 已初始化，当前分支: {BRANCH}")
            self._log(f"已初始化 Git 仓库，创建并切换到 {BRANCH} 分支")
        else:
            ok = self._run("git branch --show-current")
            self.status_var.set("Git 仓库已就绪")

        self._load_remote_url()

    def _load_remote_url(self):
        try:
            result = subprocess.run(
                f"git remote get-url {REMOTE_NAME}",
                shell=True, cwd=WORK_DIR, capture_output=True, text=True, encoding="utf-8", errors="replace"
            )
            if result.returncode == 0:
                url = result.stdout.strip()
                self.remote_var.set(url)
                self._log(f"已读取远程仓库: {url}")
            else:
                self._log("未配置远程仓库，请输入地址后点击「设置远程仓库」")
        except Exception:
            pass

    def _set_remote(self):
        url = self.remote_var.get().strip()
        if not url:
            messagebox.showwarning("提示", "请输入远程仓库地址")
            return

        existing = subprocess.run(
            f"git remote get-url {REMOTE_NAME}",
            shell=True, cwd=WORK_DIR, capture_output=True, text=True, encoding="utf-8", errors="replace"
        )
        if existing.returncode == 0:
            self._run(f"git remote set-url {REMOTE_NAME} {url}")
            self._log(f"远程仓库地址已更新为: {url}")
        else:
            self._run(f"git remote add {REMOTE_NAME} {url}")
            self._log(f"远程仓库已添加: {url}")

        messagebox.showinfo("成功", "远程仓库设置完成")

    def _disable_buttons(self):
        self.push_btn.configure(state="disabled")
        self.pull_btn.configure(state="disabled")
        self.remote_btn.configure(state="disabled")

    def _enable_buttons(self):
        self.push_btn.configure(state="normal")
        self.pull_btn.configure(state="normal")
        self.remote_btn.configure(state="normal")

    def _push(self):
        commit_msg = self.commit_var.get().strip() or "update"
        self._disable_buttons()
        self._log("=" * 50)
        self._log("开始上传到 main 分支...")

        def worker():
            try:
                self._run("git add -A")

                check = subprocess.run(
                    "git diff --cached --quiet",
                    shell=True, cwd=WORK_DIR, capture_output=True
                )
                if check.returncode == 0:
                    self._log("没有新的更改需要提交")
                    return

                self._run(f'git commit -m "{commit_msg}"')

                check_remote = subprocess.run(
                    f"git remote get-url {REMOTE_NAME}",
                    shell=True, cwd=WORK_DIR, capture_output=True, text=True, encoding="utf-8", errors="replace"
                )
                if check_remote.returncode != 0:
                    self._log("[错误] 未设置远程仓库，请先设置")
                    return

                ok = self._run(f"git push -u {REMOTE_NAME} {BRANCH}")
                if ok:
                    self._log("上传完成!")
                else:
                    self._log("上传失败，请检查日志")
            finally:
                self.root.after(0, self._enable_buttons)

        threading.Thread(target=worker, daemon=True).start()

    def _pull(self):
        self._disable_buttons()
        self._log("=" * 50)
        self._log("开始从 main 分支拉取...")

        def worker():
            try:
                check_remote = subprocess.run(
                    f"git remote get-url {REMOTE_NAME}",
                    shell=True, cwd=WORK_DIR, capture_output=True, text=True, encoding="utf-8", errors="replace"
                )
                if check_remote.returncode != 0:
                    self._log("[错误] 未设置远程仓库，请先设置")
                    return

                ok = self._run(f"git pull {REMOTE_NAME} {BRANCH}")
                if ok:
                    self._log("拉取完成!")
                else:
                    self._log("拉取失败，请检查日志")
            finally:
                self.root.after(0, self._enable_buttons)

        threading.Thread(target=worker, daemon=True).start()


if __name__ == "__main__":
    root = tk.Tk()
    app = GitSyncApp(root)
    root.mainloop()
