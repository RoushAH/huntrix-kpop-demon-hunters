import boto3
import json
import base64
from datetime import datetime

def generate_image(prompt, output_path="test_output.png"):
    """Generate an image using Amazon Nova Canvas on Bedrock"""

    bedrock = boto3.client(
        service_name='bedrock-runtime',
        region_name='us-east-1'
    )

    # Nova Canvas request format
    request_body = {
        "taskType": "TEXT_IMAGE",
        "textToImageParams": {
            "text": prompt
        },
        "imageGenerationConfig": {
            "numberOfImages": 1,
            "quality": "standard",  # or "premium"
            "height": 1024,
            "width": 1024,
            "cfgScale": 8.0,
            "seed": 42
        }
    }

    response = bedrock.invoke_model(
        modelId='amazon.nova-canvas-v1:0',
        body=json.dumps(request_body),
        contentType='application/json',
        accept='application/json'
    )

    response_body = json.loads(response['body'].read())

    # Extract and save the image
    if 'images' in response_body and len(response_body['images']) > 0:
        image_data = base64.b64decode(response_body['images'][0])
        with open(output_path, 'wb') as f:
            f.write(image_data)
        print(f"✓ Image saved to {output_path}")
        return output_path
    else:
        print("Error: No image in response")
        print(json.dumps(response_body, indent=2))
        return None

if __name__ == "__main__":
    # Test prompt
    prompt = "A professional K-pop album cover design featuring abstract geometric patterns in vibrant pink and blue, modern minimalist style, high quality digital art"

    output = generate_image(prompt, "bedrock_test.png")
    if output:
        print(f"\n✓ Successfully generated image from prompt:")
        print(f"  '{prompt}'")
