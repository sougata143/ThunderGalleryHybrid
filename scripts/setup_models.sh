#!/bin/bash

# Create directories if they don't exist
mkdir -p assets/models/object_detection
mkdir -p assets/models/style_transfer

# Install tensorflowjs tools
pip install tensorflowjs

# Download and convert object detection model (using MobileNet SSD)
curl -L "https://tfhub.dev/tensorflow/lite-model/ssd_mobilenet_v1/1/metadata/1?lite-format=tflite" -o "temp_object_detection.tflite"
tensorflowjs_converter \
    --input_format=tf_lite \
    --output_format=tfjs_graph_model \
    temp_object_detection.tflite \
    assets/models/object_detection/

# Download and convert style transfer model (using arbitrary-image-stylization-v1)
curl -L "https://tfhub.dev/google/lite-model/magenta/arbitrary-image-stylization-v1-256/int8/prediction/1?lite-format=tflite" -o "temp_style_transfer.tflite"
tensorflowjs_converter \
    --input_format=tf_lite \
    --output_format=tfjs_graph_model \
    temp_style_transfer.tflite \
    assets/models/style_transfer/

# Clean up temporary files
rm temp_object_detection.tflite
rm temp_style_transfer.tflite

echo "Models have been downloaded and converted successfully!"
