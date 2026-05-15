import tkinter as tk
from tkinter import ttk, filedialog, messagebox, scrolledtext
import subprocess
import os
import threading
from datetime import datetime

class GitHubManager:
    def __init__(self):
        self.root = tk.Tk()
        self.root.title("GitHub Main 工具 - 自动识别仓库版")
        self.root.geometry("900x700")
        self.root.configure(bg='#1e1e1e')
        
        self.repo_path = tk.StringVar()
        self.remote_url = tk.StringVar(value="未检测到")
        
        self.setup_ui()
        self.auto_detect_repo()   # 启动时自动检测
    
    def setup_ui(self):
        title = tk.Label(self.root, text="GitHub Main 操作工具（自动识别版）", 
                        font=("微软雅黑", 16, "bold"), fg="#ff4444", bg='#1e1e1e')
        title.pack(pady=10)
        
        # 路径 + 远程地址
        path_frame = tk.Frame(self.root, bg='#1e1e1e')
        path_frame.pack(fill=tk.X, padx=20, pady=8)
        
        tk.Label(path_frame, text="仓库路径:", bg='#1e1e1e', fg='white').pack(side=tk.LEFT)
        tk.Entry(path_frame, textvariable=self.repo_path, width=60, bg='#333333', fg='white').pack(side=tk.LEFT, padx=5)
        tk.Button(path_frame, text="手动选择", command=self.select_repo, bg='#ff4444', fg='white').pack(side=tk.LEFT, padx=5)
        tk.Button(path_frame, text="刷新", command=self.auto_detect_repo, bg='#666666', fg='white').pack(side=tk.LEFT)
        
        # 远程地址显示
        remote_frame = tk.Frame(self.root, bg='#1e1e1e')
        remote_frame.pack(fill=tk.X, padx=20, pady=5)
        tk.Label(remote_frame, text="远程仓库:", bg='#1e1e1e', fg='white').pack(side=tk.LEFT)
        tk.Label(remote_frame, textvariable=self.remote_url, bg='#1e1e1e', fg='#00ffff', anchor='w').pack(side=tk.LEFT, fill=tk.X)
        
        # 操作按钮
        btn_frame = tk.Frame(self.root, bg='#1e1e1e')
        btn_frame.pack(pady=12)
        
        tk.Button(btn_frame, text="🔄 拉取 main", width=16, height=2,
                 command=self.start_pull, bg='#00cc00', fg='white').pack(side=tk.LEFT, padx=10)
        tk.Button(btn_frame, text="📤 提交并推送", width=16, height=2,
                 command=self.start_push, bg='#ff8800', fg='white').pack(side=tk.LEFT, padx=10)
        tk.Button(btn_frame, text="⚡ 一键同步", width=18, height=2,
                 command=self.start_sync, bg='#cc00cc', fg='white').pack(side=tk.LEFT, padx=10)
        
        # 提交信息
        commit_frame = tk.Frame(self.root, bg='#1e1e1e')
        commit_frame.pack(fill=tk.X, padx=20, pady=5)
        tk.Label(commit_frame, text="提交信息:", bg='#1e1e1e', fg='white').pack(anchor=tk.W)
        self.commit_msg = tk.Entry(commit_frame, bg='#333333', fg='white')
        self.commit_msg.pack(fill=tk.X, padx=5, pady=5)
        self.commit_msg.insert(0, f"更新于 {datetime.now().strftime('%Y-%m-%d %H:%M')}")
        
        # 日志
        log_frame = tk.Frame(self.root, bg='#1e1e1e')
        log_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=10)
        tk.Label(log_frame, text="操作日志:", bg='#1e1e1e', fg='white').pack(anchor=tk.W)
        self.log_text = scrolledtext.ScrolledText(log_frame, height=22, bg='#0f0f0f', fg='#00ff88', font=("Consolas", 10))
        self.log_text.pack(fill=tk.BOTH, expand=True)
        
        self.status = tk.Label(self.root, text="就绪", bg='#1e1e1e', fg='#ffff00')
        self.status.pack(side=tk.BOTTOM, fill=tk.X)
        
        self.log("启动成功，已自动尝试识别当前仓库。")

    def log(self, message):
        timestamp = datetime.now().strftime("%H:%M:%S")
        try:
            self.log_text.insert(tk.END, f"[{timestamp}] {message}\n")
            self.log_text.see(tk.END)
        except:
            pass

    def run_git(self, cmd, cwd=None):
        try:
            result = subprocess.run(
                cmd, cwd=cwd or self.repo_path.get(),
                capture_output=True, text=True,
                encoding='utf-8', errors='replace',
                timeout=120
            )
            return result
        except Exception as e:
            class Fake: 
                returncode = -1
                stdout = ""
                stderr = str(e)
            return Fake()

    def auto_detect_repo(self):
        """自动检测当前工作目录是否在 git 仓库内"""
        current_dir = os.getcwd()
        git_dir = os.path.join(current_dir, ".git")
        
        if os.path.exists(git_dir):
            self.repo_path.set(current_dir)
            self.log(f"自动识别到当前仓库: {current_dir}")
            
            # 获取远程地址
            result = self.run_git(["git", "remote", "get-url", "origin"], cwd=current_dir)
            if result.returncode == 0 and result.stdout.strip():
                url = result.stdout.strip()
                self.remote_url.set(url)
                self.log(f"远程仓库: {url}")
            else:
                self.remote_url.set("未设置 origin")
            return True
        else:
            self.log("当前目录不是 git 仓库，请手动选择")
            self.remote_url.set("未检测到")
            return False

    def select_repo(self):
        path = filedialog.askdirectory()
        if path:
            self.repo_path.set(path)
            self.log(f"手动切换仓库: {path}")
            # 刷新远程地址
            result = self.run_git(["git", "remote", "get-url", "origin"], cwd=path)
            if result.returncode == 0:
                self.remote_url.set(result.stdout.strip())
            else:
                self.remote_url.set("未设置 origin")

    def log_git_result(self, result, action):
        if result.returncode == 0:
            self.log(f"✅ {action} 成功")
            if result.stdout.strip():
                self.log(result.stdout.strip()[:500])
        else:
            err = (result.stderr or result.stdout or "未知错误")[:600]
            self.log(f"❌ {action} 失败 → {err}")

    # auto_resolve_conflicts、pull、push 等函数保持和上次一样（已修复版）
    def get_conflicted_files(self):
        result = self.run_git(["git", "ls-files", "--unmerged"])
        if result.returncode != 0: return []
        files = {line.split()[-1] for line in result.stdout.splitlines() if line.strip()}
        return list(files)

    def auto_resolve_conflicts(self):
        conflicted = self.get_conflicted_files()
        if not conflicted: return True
        
        self.log(f"发现 {len(conflicted)} 个冲突，正在按时间优先解决...")
        for f in conflicted:
            try:
                ours = self.run_git(["git", "log", "-1", "--format=%ct", "HEAD", "--", f])
                theirs = self.run_git(["git", "log", "-1", "--format=%ct", "MERGE_HEAD", "--", f])
                
                ours_ts = int(ours.stdout.strip() or 0)
                theirs_ts = int(theirs.stdout.strip() or 0)
                
                if theirs_ts > ours_ts:
                    self.run_git(["git", "checkout", "--theirs", f])
                    self.log(f"🕒 {f} → 采用远程更新的版本")
                else:
                    self.run_git(["git", "checkout", "--ours", f])
                    self.log(f"🕒 {f} → 保留本地更新的版本")
                self.run_git(["git", "add", f])
            except:
                self.run_git(["git", "checkout", "--theirs", f])
                self.run_git(["git", "add", f])
                self.log(f"⚠️ {f} 处理异常，已强制使用远程")
        return True

    def pull(self):
        self.status.config(text="拉取中...", fg='#00ccff')
        self.log("正在 fetch + merge...")
        
        self.run_git(["git", "fetch", "origin", "main"])
        merge = self.run_git(["git", "merge", "origin/main", "--no-ff"])
        
        if merge.returncode == 0:
            self.log("✅ 干净合并")
        elif "CONFLICT" in (merge.stderr or merge.stdout or ""):
            self.log("⚔️ 冲突！启动自动解决...")
            if self.auto_resolve_conflicts():
                self.run_git(["git", "commit", "--no-edit"])
        else:
            self.log_git_result(merge, "Merge")
        
        self.status.config(text="拉取完成", fg='#00ff00')

    def push(self):
        self.status.config(text="推送中...", fg='#00ccff')
        msg = self.commit_msg.get().strip() or f"更新于 {datetime.now().strftime('%Y-%m-%d %H:%M')}"
        
        self.run_git(["git", "add", "."])
        commit = self.run_git(["git", "commit", "-m", msg])
        self.log_git_result(commit, "Commit")
        
        push = self.run_git(["git", "push", "origin", "main"])
        self.log_git_result(push, "Push")
        self.status.config(text="推送完成", fg='#00ff00' if push.returncode == 0 else '#ff4444')

    def start_pull(self):
        if not self.check_repo(): return
        threading.Thread(target=self.pull, daemon=True).start()

    def start_push(self):
        if not self.check_repo(): return
        threading.Thread(target=self.push, daemon=True).start()

    def start_sync(self):
        if not self.check_repo(): return
        threading.Thread(target=lambda: (self.pull(), self.push()), daemon=True).start()

    def check_repo(self):
        if not self.repo_path.get() or not os.path.exists(self.repo_path.get()):
            messagebox.showwarning("警告", "当前没有有效仓库路径！")
            return False
        return True

    def run(self):
        self.root.mainloop()


if __name__ == "__main__":
    # 建议把脚本放在你的 auction-king-main 文件夹里运行
    app = GitHubManager()
    app.run()