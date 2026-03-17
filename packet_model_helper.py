import zipfile
import json
import os
import re

def clean_device_name(name):
    """
    移除特定的尾綴：-w, -w1, -w2, -cn
    但保留像 active2-2024 這種非定義中的尾綴
    """
    # 使用正則表達式匹配結尾為 -w, -w1, -w2, 或 -cn 的字串
    # $ 表示字串結尾
    return re.sub(r'-(w|w1|w2|cn)$', '', name)

def extract_platform_names():
    output_file = "device_compatibility_report.txt"
    results = []

    # 1. 獲取當前目錄下所有 .zpk 檔案
    zpk_files = [f for f in os.listdir('.') if f.endswith('.zpk')]

    if not zpk_files:
        print("目錄下找不到任何 .zpk 檔案。")
        return

    print(f"開始處理 {len(zpk_files)} 個檔案並篩選型號...")

    for zpk_name in zpk_files:
        try:
            with zipfile.ZipFile(zpk_name, 'r') as zpk:
                if 'device.zip' in zpk.namelist():
                    with zpk.open('device.zip') as device_zip_data:
                        with zipfile.ZipFile(device_zip_data) as dev_zip:
                            if 'app.json' in dev_zip.namelist():
                                with dev_zip.open('app.json') as f:
                                    content = json.load(f)
                                    
                                    # 提取原始名稱
                                    platforms = content.get('platforms', [])
                                    raw_names = [p.get('name') for p in platforms if 'name' in p]
                                    
                                    # --- 修正邏輯開始 ---
                                    # 1. 清理名稱 2. 使用 set 去重 3. 轉回 list 排序
                                    cleaned_names = sorted(list(set(clean_device_name(n) for n in raw_names)))
                                    # --- 修正邏輯結束 ---
                                    
                                    results.append({
                                        'filename': zpk_name,
                                        'devices': cleaned_names
                                    })
                            else:
                                results.append({'filename': zpk_name, 'devices': ['[Error: app.json missing]']})
                else:
                    results.append({'filename': zpk_name, 'devices': ['[Error: device.zip missing]']})

        except Exception as e:
            results.append({'filename': zpk_name, 'devices': [f'[Error: {str(e)}]']})

    # 6. 輸出報告
    with open(output_file, 'w', encoding='utf-8') as out:
        out.write("ZPK 檔案與主要型號對照表 (已過濾延伸型號)\n")
        out.write("=" * 60 + "\n\n")
        
        for item in results:
            out.write(f"檔案名稱: {item['filename']}\n")
            out.write(f"主要型號: {', '.join(item['devices'])}\n")
            out.write("-" * 60 + "\n")

    print(f"處理完成！結果已儲存至: {output_file}")

if __name__ == "__main__":
    extract_platform_names()