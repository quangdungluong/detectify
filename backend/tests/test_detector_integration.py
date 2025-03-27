import os
import sys

sys.path.insert(0, os.getcwd())

from app.core.config import settings
from app.services.detector import PersonDetector


def test_detect_real_image():
    """Test detection with a real image"""
    detector = PersonDetector()

    test_image_path = os.path.join(settings.STATIC_DIR, "test_images", "bus.jpg")

    assert os.path.exists(test_image_path), f"Test image not found at {test_image_path}"

    count, output_path = detector.detect(test_image_path)

    # Check results
    assert count >= 0  # Should detect at least 0 persons
    assert os.path.exists(output_path)  # Output image should be saved
    assert output_path.endswith(".jpg")  # Should be a jpg file
