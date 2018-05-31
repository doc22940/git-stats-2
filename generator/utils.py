import os
import subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(HERE)


def run(cmd, cwd=PROJECT_DIR):
    """
    A convenient wrapper around subprocess.run()

    :param cmd: shell command as string
    :return: subprocess.CompletedProcess
    """
    return subprocess.run(cmd, check=True, shell=True, cwd=cwd,
                          stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                          universal_newlines=True)


def run_git(workdir, repo, cmd):
    """
    Run a git command in a repo inside the workdir

    :param workdir: the working root folder full path
    :param repo: the repo name residing inside the working folder
    :param cmd: a git sub-command ti run

    :return: git output
    """
    return run(f'git {cmd}', os.path.join(workdir, repo)).stdout.strip()
