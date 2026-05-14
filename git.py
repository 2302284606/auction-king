#!/usr/bin/env python3
"""
自动化GitHub上传脚本 - 增强版
功能: 自动commit和push、分支管理、远程仓库管理、PR管理
"""

import subprocess
import sys
import os
from datetime import datetime
import argparse
import logging
import json
from typing import List, Dict, Optional, Tuple
import re

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('github_sync.log'),
        logging.StreamHandler()
    ]
)

class GitHubAutoUploader:
    def __init__(self, repo_path=None):
        self.repo_path = repo_path or os.getcwd()
        self.config_file = os.path.join(self.repo_path, '.github_config.json')
        self.config = self.load_config()
        
    def load_config(self):
        """加载配置文件"""
        default_config = {
            'default_branch': 'main',
            'pr_template': '## 变更说明\n\n- \n\n## 测试情况\n\n- \n\n## 相关Issue\n\n- ',
            'auto_pr': False,
            'pr_reviewers': [],
            'protected_branches': ['main', 'master', 'develop'],
            'remote_aliases': {}
        }
        
        if os.path.exists(self.config_file):
            try:
                with open(self.config_file, 'r', encoding='utf-8') as f:
                    config = json.load(f)
                    default_config.update(config)
            except Exception as e:
                logging.warning(f"加载配置文件失败: {e}")
        
        return default_config
    
    def save_config(self):
        """保存配置文件"""
        try:
            with open(self.config_file, 'w', encoding='utf-8') as f:
                json.dump(self.config, f, indent=2, ensure_ascii=False)
            logging.info(f"配置已保存到 {self.config_file}")
        except Exception as e:
            logging.error(f"保存配置失败: {e}")
    
    def run_command(self, command: str, check: bool = True) -> Tuple[bool, str]:
        """执行shell命令并返回结果"""
        try:
            result = subprocess.run(
                command, 
                shell=True, 
                cwd=self.repo_path,
                capture_output=True, 
                text=True,
                check=check
            )
            return True, result.stdout.strip()
        except subprocess.CalledProcessError as e:
            return False, e.stderr.strip()
    
    def check_git_repo(self) -> bool:
        """检查是否是git仓库"""
        success, _ = self.run_command("git rev-parse --git-dir", check=False)
        if not success:
            logging.error("当前目录不是git仓库")
            return False
        return True
    
    def get_current_branch(self) -> Optional[str]:
        """获取当前分支"""
        success, branch = self.run_command("git branch --show-current", check=False)
        if not success:
            logging.error("无法获取当前分支")
            return None
        return branch
    
    def get_all_branches(self) -> List[str]:
        """获取所有分支"""
        success, output = self.run_command("git branch -a", check=False)
        if not success:
            return []
        
        branches = []
        for line in output.split('\n'):
            line = line.strip()
            if line and not line.startswith('remotes/'):
                branches.append(line.replace('*', '').strip())
            elif line.startswith('remotes/origin/'):
                branch = line.replace('remotes/origin/', '').strip()
                if branch not in ['HEAD']:
                    branches.append(branch)
        
        return list(set(branches))
    
    def has_changes(self) -> bool:
        """检查是否有更改"""
        success, output = self.run_command("git status --porcelain", check=False)
        if not success:
            return False
        return bool(output.strip())
    
    def add_files(self, files: List[str] = None) -> bool:
        """添加文件到暂存区"""
        if files:
            for file in files:
                success, _ = self.run_command(f"git add {file}", check=False)
                if not success:
                    logging.warning(f"添加文件失败: {file}")
        else:
            success, _ = self.run_command("git add .", check=False)
            if not success:
                logging.error("添加文件失败")
                return False
        logging.info("文件已添加到暂存区")
        return True
    
    def commit(self, message: str) -> bool:
        """提交更改"""
        # 转义双引号
        message = message.replace('"', '\\"')
        success, output = self.run_command(f'git commit -m "{message}"', check=False)
        if success:
            logging.info(f"提交成功: {message}")
            return True
        else:
            logging.error(f"提交失败: {output}")
            return False
    
    def pull_latest(self, branch: str = None, rebase: bool = True) -> bool:
        """拉取最新更改"""
        if not branch:
            branch = self.get_current_branch()
            if not branch:
                return False
        
        cmd = "git pull --rebase" if rebase else "git pull"
        success, output = self.run_command(cmd, check=False)
        if success:
            logging.info(f"已拉取 {branch} 的最新更改")
            return True
        else:
            logging.warning(f"拉取失败: {output}")
            return False
    
    def push(self, branch: str, remote: str = 'origin', force: bool = False) -> bool:
        """推送到远程仓库"""
        cmd = f"git push {remote} {branch}"
        if force:
            cmd += " --force"
        
        success, output = self.run_command(cmd, check=False)
        if success:
            logging.info(f"成功推送到 {remote}/{branch}")
            return True
        else:
            logging.error(f"推送失败: {output}")
            return False
    
    def get_status(self) -> str:
        """获取仓库状态"""
        success, output = self.run_command("git status -s", check=False)
        if success:
            return output
        return ""
    
    # ============ 分支管理功能 ============
    
    def create_branch(self, branch_name: str, from_branch: str = None) -> bool:
        """创建新分支"""
        # 检查分支是否已存在
        branches = self.get_all_branches()
        if branch_name in branches:
            logging.error(f"分支 {branch_name} 已存在")
            return False
        
        # 创建分支
        if from_branch:
            cmd = f"git checkout -b {branch_name} {from_branch}"
        else:
            cmd = f"git checkout -b {branch_name}"
        
        success, output = self.run_command(cmd, check=False)
        if success:
            logging.info(f"创建并切换到分支: {branch_name}")
            return True
        else:
            logging.error(f"创建分支失败: {output}")
            return False
    
    def switch_branch(self, branch_name: str) -> bool:
        """切换分支"""
        success, output = self.run_command(f"git checkout {branch_name}", check=False)
        if success:
            logging.info(f"已切换到分支: {branch_name}")
            return True
        else:
            logging.error(f"切换分支失败: {output}")
            return False
    
    def delete_branch(self, branch_name: str, force: bool = False) -> bool:
        """删除分支"""
        # 保护主分支
        if branch_name in self.config['protected_branches']:
            logging.error(f"不能删除受保护的分支: {branch_name}")
            return False
        
        cmd = f"git branch -d {branch_name}"
        if force:
            cmd = f"git branch -D {branch_name}"
        
        success, output = self.run_command(cmd, check=False)
        if success:
            logging.info(f"已删除本地分支: {branch_name}")
            
            # 删除远程分支
            self.run_command(f"git push origin --delete {branch_name}", check=False)
            return True
        else:
            logging.error(f"删除分支失败: {output}")
            return False
    
    def merge_branch(self, source_branch: str, target_branch: str = None, 
                     no_ff: bool = True) -> bool:
        """合并分支"""
        current_branch = self.get_current_branch()
        
        # 切换到目标分支
        if target_branch and target_branch != current_branch:
            if not self.switch_branch(target_branch):
                return False
        
        # 拉取最新代码
        if not self.pull_latest():
            logging.warning("拉取最新代码失败,继续合并...")
        
        # 执行合并
        cmd = f"git merge {source_branch}"
        if no_ff:
            cmd += " --no-ff"
        
        success, output = self.run_command(cmd, check=False)
        if success:
            logging.info(f"成功将 {source_branch} 合并到 {target_branch or current_branch}")
            return True
        else:
            logging.error(f"合并失败: {output}")
            return False
    
    # ============ 远程仓库管理 ============
    
    def list_remotes(self) -> Dict[str, str]:
        """列出所有远程仓库"""
        success, output = self.run_command("git remote -v", check=False)
        if not success:
            return {}
        
        remotes = {}
        for line in output.split('\n'):
            if '(fetch)' in line:
                parts = line.split()
                if len(parts) >= 2:
                    name = parts[0]
                    url = parts[1]
                    remotes[name] = url
        
        return remotes
    
    def add_remote(self, name: str, url: str) -> bool:
        """添加远程仓库"""
        success, output = self.run_command(f"git remote add {name} {url}", check=False)
        if success:
            logging.info(f"已添加远程仓库: {name} -> {url}")
            return True
        else:
            logging.error(f"添加远程仓库失败: {output}")
            return False
    
    def remove_remote(self, name: str) -> bool:
        """删除远程仓库"""
        success, output = self.run_command(f"git remote remove {name}", check=False)
        if success:
            logging.info(f"已删除远程仓库: {name}")
            return True
        else:
            logging.error(f"删除远程仓库失败: {output}")
            return False
    
    def sync_remote(self, remote_name: str = 'origin', fetch_all: bool = True) -> bool:
        """同步远程仓库"""
        cmd = f"git fetch {remote_name}"
        if fetch_all:
            cmd += " --all"
        
        success, output = self.run_command(cmd, check=False)
        if success:
            logging.info(f"已同步远程仓库: {remote_name}")
            return True
        else:
            logging.error(f"同步远程仓库失败: {output}")
            return False
    
    # ============ PR管理功能 ============
    
    def create_pr(self, title: str, body: str = None, head_branch: str = None,
                  base_branch: str = None, reviewers: List[str] = None) -> bool:
        """创建Pull Request"""
        # 注意: 这个功能需要使用GitHub CLI (gh) 或 GitHub API
        
        # 检查是否安装了gh
        success, _ = self.run_command("gh --version", check=False)
        if not success:
            logging.error("未安装GitHub CLI (gh), 请先安装: https://cli.github.com/")
            logging.info("或使用GitHub API方式")
            return self.create_pr_via_api(title, body, head_branch, base_branch, reviewers)
        
        head_branch = head_branch or self.get_current_branch()
        base_branch = base_branch or self.config.get('default_branch', 'main')
        
        # 准备PR内容
        if not body:
            body = self.config.get('pr_template', '')
            body += f"\n\n## 分支信息\n- 源分支: {head_branch}\n- 目标分支: {base_branch}\n"
        
        # 构建命令
        cmd = f'gh pr create --title "{title}" --body "{body}" --base {base_branch} --head {head_branch}'
        
        if reviewers:
            cmd += f" --reviewer {','.join(reviewers)}"
        
        success, output = self.run_command(cmd, check=False)
        if success:
            logging.info(f"PR创建成功: {output}")
            return True
        else:
            logging.error(f"创建PR失败: {output}")
            return False
    
    def create_pr_via_api(self, title: str, body: str = None, head_branch: str = None,
                         base_branch: str = None, reviewers: List[str] = None) -> bool:
        """通过GitHub API创建PR"""
        import requests
        from urllib.parse import urlparse
        
        # 获取远程仓库URL
        remotes = self.list_remotes()
        origin_url = remotes.get('origin', '')
        if not origin_url:
            logging.error("未找到远程仓库origin")
            return False
        
        # 解析仓库信息
        match = re.search(r'github\.com[:/](.+?)(\.git)?$', origin_url)
        if not match:
            logging.error("无法解析GitHub仓库地址")
            return False
        
        repo = match.group(1).replace(':', '/')
        
        # 从git配置获取token
        success, token = self.run_command("git config --global github.token", check=False)
        if not success or not token:
            logging.error("未设置GitHub token, 请运行: git config --global github.token YOUR_TOKEN")
            return False
        
        # 准备API请求
        api_url = f"https://api.github.com/repos/{repo}/pulls"
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json"
        }
        
        head_branch = head_branch or self.get_current_branch()
        base_branch = base_branch or self.config.get('default_branch', 'main')
        
        data = {
            "title": title,
            "head": head_branch,
            "base": base_branch,
            "body": body or self.config['pr_template']
        }
        
        try:
            response = requests.post(api_url, json=data, headers=headers)
            if response.status_code == 201:
                pr_data = response.json()
                logging.info(f"PR创建成功: {pr_data['html_url']}")
                
                # 添加reviewers
                if reviewers:
                    self.add_pr_reviewers(pr_data['number'], reviewers, token, repo)
                
                return True
            else:
                logging.error(f"API错误: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            logging.error(f"创建PR异常: {e}")
            return False
    
    def add_pr_reviewers(self, pr_number: int, reviewers: List[str], token: str, repo: str):
        """为PR添加reviewers"""
        import requests
        
        api_url = f"https://api.github.com/repos/{repo}/pulls/{pr_number}/requested_reviewers"
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json"
        }
        data = {"reviewers": reviewers}
        
        try:
            response = requests.post(api_url, json=data, headers=headers)
            if response.status_code == 201:
                logging.info(f"已添加reviewers: {', '.join(reviewers)}")
            else:
                logging.warning(f"添加reviewers失败: {response.text}")
        except Exception as e:
            logging.warning(f"添加reviewers异常: {e}")
    
    def list_prs(self, state: str = 'open') -> List[Dict]:
        """列出Pull Requests"""
        success, output = self.run_command(f"gh pr list --state {state}", check=False)
        if not success:
            logging.error("获取PR列表失败")
            return []
        
        prs = []
        for line in output.split('\n'):
            if line:
                parts = line.split('\t')
                if len(parts) >= 3:
                    prs.append({
                        'number': parts[0],
                        'title': parts[1],
                        'branch': parts[2],
                        'state': state
                    })
        
        return prs
    
    def checkout_pr(self, pr_number: int) -> bool:
        """检出PR到本地"""
        success, output = self.run_command(f"gh pr checkout {pr_number}", check=False)
        if success:
            logging.info(f"已检出PR #{pr_number}")
            return True
        else:
            logging.error(f"检出PR失败: {output}")
            return False
    
    # ============ 主流程 ============
    
    def auto_upload(self, commit_msg: str, skip_pull: bool = False, 
                   create_pr: bool = False, target_branch: str = None) -> bool:
        """自动上传主流程"""
        logging.info("开始自动上传流程...")
        
        # 检查git仓库
        if not self.check_git_repo():
            return False
        
        # 获取当前分支
        current_branch = self.get_current_branch()
        if not current_branch:
            return False
        logging.info(f"当前分支: {current_branch}")
        
        # 检查是否在受保护分支上
        is_protected = current_branch in self.config['protected_branches']
        if is_protected and create_pr:
            logging.warning(f"当前在受保护分支 {current_branch} 上, 将创建新分支进行开发")
            feature_branch = f"feature/{datetime.now().strftime('%Y%m%d_%H%M%S')}"
            if not self.create_branch(feature_branch):
                return False
            current_branch = feature_branch
        
        # 检查是否有更改
        if not self.has_changes():
            logging.info("没有需要提交的更改")
            return True
        
        # 显示更改状态
        status = self.get_status()
        if status:
            logging.info(f"待提交文件:\n{status}")
        
        # 添加所有文件
        if not self.add_files():
            return False
        
        # 提交
        if not self.commit(commit_msg):
            return False
        
        # 拉取最新更改(可选)
        if not skip_pull:
            self.pull_latest(current_branch)
        
        # 推送
        if not self.push(current_branch):
            return False
        
        # 创建PR(如果需要)
        if create_pr:
            if target_branch:
                base = target_branch
            else:
                base = self.config.get('default_branch', 'main')
            
            if current_branch != base:
                pr_title = f"Merge {current_branch} to {base}"
                pr_body = f"## 自动PR\n\n提交信息: {commit_msg}\n\n这个PR由自动化脚本创建"
                
                if self.create_pr(pr_title, pr_body, current_branch, base):
                    logging.info(f"PR已创建, 目标分支: {base}")
                else:
                    logging.warning("PR创建失败, 但代码已推送")
        
        logging.info("✅ 自动上传完成!")
        return True

def main():
    parser = argparse.ArgumentParser(description='GitHub自动化上传脚本 - 增强版')
    
    # 基础功能
    parser.add_argument('-m', '--message', help='提交信息')
    parser.add_argument('-p', '--path', help='仓库路径(默认为当前目录)')
    parser.add_argument('--skip-pull', action='store_true', help='跳过git pull')
    parser.add_argument('--auto-msg', action='store_true', help='自动生成提交信息')
    
    # 分支管理
    parser.add_argument('--create-branch', help='创建新分支')
    parser.add_argument('--switch-branch', help='切换分支')
    parser.add_argument('--delete-branch', help='删除分支')
    parser.add_argument('--merge-branch', nargs=2, metavar=('SOURCE', 'TARGET'), 
                       help='合并分支: --merge-branch source target')
    parser.add_argument('--list-branches', action='store_true', help='列出所有分支')
    
    # 远程仓库管理
    parser.add_argument('--list-remotes', action='store_true', help='列出远程仓库')
    parser.add_argument('--add-remote', nargs=2, metavar=('NAME', 'URL'), 
                       help='添加远程仓库')
    parser.add_argument('--remove-remote', help='删除远程仓库')
    parser.add_argument('--sync-remote', help='同步远程仓库')
    
    # PR管理
    parser.add_argument('--create-pr', action='store_true', help='创建Pull Request')
    parser.add_argument('--pr-title', help='PR标题')
    parser.add_argument('--pr-body', help='PR内容')
    parser.add_argument('--target-branch', help='PR目标分支')
    parser.add_argument('--reviewers', nargs='+', help='PR审核人')
    parser.add_argument('--list-prs', action='store_true', help='列出PR')
    parser.add_argument('--checkout-pr', type=int, help='检出PR到本地')
    
    # 配置
    parser.add_argument('--config', action='store_true', help='显示当前配置')
    parser.add_argument('--set-config', nargs=2, metavar=('KEY', 'VALUE'), 
                       help='设置配置项')
    
    args = parser.parse_args()
    
    # 初始化上传器
    uploader = GitHubAutoUploader(args.path)
    
    # 配置管理
    if args.config:
        print(json.dumps(uploader.config, indent=2, ensure_ascii=False))
        return
    
    if args.set_config:
        key, value = args.set_config
        # 尝试解析JSON值
        try:
            value = json.loads(value)
        except:
            pass
        uploader.config[key] = value
        uploader.save_config()
        print(f"已设置 {key} = {value}")
        return
    
    # 分支管理
    if args.list_branches:
        branches = uploader.get_all_branches()
        current = uploader.get_current_branch()
        for branch in branches:
            prefix = "* " if branch == current else "  "
            print(f"{prefix}{branch}")
        return
    
    if args.create_branch:
        success = uploader.create_branch(args.create_branch)
        sys.exit(0 if success else 1)
    
    if args.switch_branch:
        success = uploader.switch_branch(args.switch_branch)
        sys.exit(0 if success else 1)
    
    if args.delete_branch:
        success = uploader.delete_branch(args.delete_branch)
        sys.exit(0 if success else 1)
    
    if args.merge_branch:
        source, target = args.merge_branch
        success = uploader.merge_branch(source, target)
        sys.exit(0 if success else 1)
    
    # 远程仓库管理
    if args.list_remotes:
        remotes = uploader.list_remotes()
        for name, url in remotes.items():
            print(f"{name}\t{url}")
        return
    
    if args.add_remote:
        name, url = args.add_remote
        success = uploader.add_remote(name, url)
        sys.exit(0 if success else 1)
    
    if args.remove_remote:
        success = uploader.remove_remote(args.remove_remote)
        sys.exit(0 if success else 1)
    
    if args.sync_remote:
        success = uploader.sync_remote(args.sync_remote)
        sys.exit(0 if success else 1)
    
    # PR管理
    if args.list_prs:
        prs = uploader.list_prs()
        for pr in prs:
            print(f"#{pr['number']}: {pr['title']} ({pr['branch']}) - {pr['state']}")
        return
    
    if args.checkout_pr:
        success = uploader.checkout_pr(args.checkout_pr)
        sys.exit(0 if success else 1)
    
    # 自动生成提交信息
    commit_msg = None
    if args.auto_msg:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        commit_msg = f"Auto commit at {timestamp}"
    elif args.message:
        commit_msg = args.message
    else:
        commit_msg = input("请输入提交信息: ")
    
    # 执行自动上传
    success = uploader.auto_upload(
        commit_msg=commit_msg,
        skip_pull=args.skip_pull,
        create_pr=args.create_pr,
        target_branch=args.target_branch
    )
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()