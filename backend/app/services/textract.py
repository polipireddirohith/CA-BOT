import boto3
import os
from botocore.exceptions import NoCredentialsError

class TextractService:
    def __init__(self):
        self.client = boto3.client(
            'textract',
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
            region_name=os.getenv("AWS_REGION", "us-east-1")
        )

    def extract_text_from_bytes(self, document_bytes: bytes):
        """Extracts text from single-page PDF, JPG, or PNG."""
        try:
            response = self.client.detect_document_text(
                Document={'Bytes': document_bytes}
            )
            
            lines = []
            for block in response.get('Blocks', []):
                if block['BlockType'] == 'LINE':
                    lines.append(block['Text'])
            
            return "\n".join(lines)
        except NoCredentialsError:
            return "Error: AWS credentials not found. Please setup AWS_ACCESS_KEY_ID."
        except Exception as e:
            return f"Error extracting text: {str(e)}"

    def analyze_expense_from_bytes(self, document_bytes: bytes):
        """Specifically designed for bills/invoices/receipts."""
        try:
            response = self.client.analyze_expense(
                Document={'Bytes': document_bytes}
            )
            
            summary = []
            for doc in response.get('ExpenseDocuments', []):
                for field in doc.get('SummaryFields', []):
                    key = field.get('Type', {}).get('Text', 'Unknown')
                    val = field.get('ValueDetection', {}).get('Text', '')
                    summary.append(f"{key}: {val}")
            
            return "\n".join(summary)
        except Exception as e:
            return f"Error analyzing expense: {str(e)}"

textract_service = TextractService()
