
import os
import subprocess
from fastapi import HTTPException

# 百度网盘分享链接和提取码
BAIDU_LINK = "https://pan.baidu.com/s/1aF8BGj4colvKHcXfMG-F1A"
EXTRACTION_CODE = "1234"
LOCAL_DB_PATH = "E:/github/spokenEnglish/realtime_ai_character/stardict.db"  # 下载后的数据库文件名


def download_from_baidu(link: str, code: str, local_path: str):
    """
    从百度网盘下载文件并保存到本地项目根目录。
    """
    try:
        print("列出分享目录内容...")
        list_command = f'BaiduPCS-Go share list "{link}" --password="{code}"'
        subprocess.run(list_command, shell=True)

        print("尝试下载文件...")
        # 指定共享路径中的文件路径
        file_path = "/project/stardict.db"  # 共享路径下的文件
        # 使用--saveto指定保存目录
        download_command = f'BaiduPCS-Go d "{file_path}" --saveto "{os.path.dirname(local_path)}" --share-link "{link}" --password "{code}"'
        print(f"执行下载命令: {download_command}")

        result = subprocess.run(download_command, shell=True)

        if result.returncode != 0:
            raise HTTPException(
                status_code=500, detail="下载失败，请检查路径和参数。"
            )

        # 检查文件是否已经下载到目标路径
        if not os.path.exists(local_path):
            raise HTTPException(
                status_code=500, detail="文件下载失败，未找到 stardict.db 文件。"
            )

        print(f"文件已成功下载并保存到: {local_path}")
    except Exception as e:
        print(f"下载或文件处理失败: {str(e)}")
        raise HTTPException(
            status_code=500, detail=f"下载或文件处理失败: {str(e)}"
        )


if __name__ == "__main__":
    print(f"检查数据库文件是否存在: {LOCAL_DB_PATH}")
    if not os.path.exists(LOCAL_DB_PATH):
        print("数据库文件不存在，尝试从百度网盘下载...")
        try:
            download_from_baidu(BAIDU_LINK, EXTRACTION_CODE, LOCAL_DB_PATH)
            print(f"数据库文件已成功下载并保存到: {LOCAL_DB_PATH}")
        except HTTPException as e:
            print(f"错误: {e.detail}")
    else:
        print(f"数据库文件已存在: {LOCAL_DB_PATH}")
