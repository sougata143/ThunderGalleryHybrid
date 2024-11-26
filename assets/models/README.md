# TensorFlow.js Models

This directory contains the TensorFlow.js models used by ThunderGallery.

## Models Required:

1. Object Detection Model
   - `object_detection_model.json`
   - `object_detection_weights.bin`

2. Style Transfer Model
   - `style_transfer_model.json`
   - `style_transfer_weights.bin`

## Model Sources

You can obtain pre-trained models from:
1. TensorFlow.js Model Hub: https://tfhub.dev/
2. TensorFlow Model Garden: https://github.com/tensorflow/models

## Converting Models

To convert TensorFlow/PyTorch models to TensorFlow.js format:

```bash
# Install tensorflowjs
pip install tensorflowjs

# Convert TensorFlow SavedModel to TensorFlow.js
tensorflowjs_converter \
    --input_format=tf_saved_model \
    --output_format=tfjs_graph_model \
    --signature_name=serving_default \
    --saved_model_tags=serve \
    /path/to/saved_model \
    /path/to/tfjs_model

# Convert Keras H5 to TensorFlow.js
tensorflowjs_converter \
    --input_format=keras \
    /path/to/model.h5 \
    /path/to/tfjs_model
```

## Model Placement

Place the converted models in this directory with the following structure:
```
models/
├── object_detection/
│   ├── model.json
│   └── weights.bin
└── style_transfer/
    ├── model.json
    └── weights.bin
```
