#!/bin/bash
cd /home/kavia/workspace/code-generation/mentor-intern-submission-tracker-40980-40989/work_tracker_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

