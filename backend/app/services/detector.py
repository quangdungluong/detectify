import os
import random
import uuid

import cv2
from app.core.config import settings
from ultralytics import YOLO


class PersonDetector:
    def __init__(self):
        self.model = YOLO(settings.TRITON_URI, task="detect")

        os.makedirs(settings.IMAGES_DIR, exist_ok=True)

    def detect(self, image_path: str, conf: float = 0.5):
        image = cv2.imread(image_path)
        results = self.model.predict(
            image, conf=conf, verbose=False, classes=[0], save=False
        )[0]

        output_path = os.path.join(settings.IMAGES_DIR, f"{uuid.uuid4()}.jpg")
        for bbox in results.boxes.xyxy:
            cv2.rectangle(
                image,
                (int(bbox[0]), int(bbox[1])),
                (int(bbox[2]), int(bbox[3])),
                (
                    random.randint(0, 255),
                    random.randint(0, 255),
                    random.randint(0, 255),
                ),
                2,
            )

        cv2.imwrite(output_path, image)
        return results, output_path
