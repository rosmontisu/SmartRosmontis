import json

# 파인튜닝 이전에 json 파일 jsonl로 바꿔주세요!
def convert_json_to_jsonl(input_file_path, output_file_path):
    """
    Convert a JSON file to a JSON Lines file.

    Args:
        input_file_path (str): The path to the input JSON file.
        output_file_path (str): The path to the output JSONL file.
    """
    try:
        with open(input_file_path, 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)
        
        with open(output_file_path, 'w', encoding='utf-8') as jsonl_file:
            for item in data:
                json.dump(item, jsonl_file)
                jsonl_file.write('\n')
        print(f"Conversion successful. The output file is located at {output_file_path}")
    except json.JSONDecodeError:
        print("Error: The input file is not a valid JSON file.")
    except FileNotFoundError:
        print(f"Error: The input file was not found at {input_file_path}.")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

if __name__ == "__main__":
    input_path = input("Enter the path of the input JSON file: ")
    output_path = input("Enter the path for the output JSONL file: ")
    convert_json_to_jsonl(input_path, output_path)
