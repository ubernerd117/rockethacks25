import os
import dotenv

dotenv.load_dotenv()

GEMINI_MODEL = os.getenv("GEMINI_MODEL")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
