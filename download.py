import urllib.request
import os

urls = {
    "scratch/remember.py": "https://raw.githubusercontent.com/topoteretes/cognee/main/examples/demos/remember_recall_improve_example.py",
    "scratch/feedback.py": "https://raw.githubusercontent.com/topoteretes/cognee/main/examples/demos/feedback_score_shifting_example.py",
    "scratch/truth.py": "https://raw.githubusercontent.com/topoteretes/cognee/main/examples/demos/truth_centroid_slots_demo.py"
}

os.makedirs("scratch", exist_ok=True)
for path, url in urls.items():
    urllib.request.urlretrieve(url, path)
