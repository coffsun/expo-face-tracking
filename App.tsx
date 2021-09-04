import * as FaceDetector from "expo-face-detector";

import React, { ReactElement, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Camera } from "expo-camera";

type posType = {
  x: number;
  y: number;
};

type posGroupType = {
  leftEar: posType;
  leftEye: posType;
  leftCheek: posType;
  leftMouth: posType;
  rightEar: posType;
  rightEye: posType;
  rightCheek: posType;
  rightMouth: posType;
  mouth?: posType;
  bottomMouse?: posType;
  noseBase: posType;
};

export default function App(): ReactElement {
  const [permission, setPermission] = useState<boolean>(false);
  const [posGroup, setPosGroup] = useState<posGroupType | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setPermission(status === "granted");
    })();
  }, []);

  if (!permission) {
    return <Text>No access to camera</Text>;
  }

  const toFloorPos = (x: number, y: number): posType => {
    return {
      x: Math.floor(x),
      y: Math.floor(y),
    };
  };

  const handleDetectedFaces = ({ faces }: any) => {
    if (faces && faces[0]) {
      const {
        leftEarPosition,
        leftEyePosition,
        leftCheekPosition,
        leftMouthPosition,
        rightEarPosition,
        rightEyePosition,
        rightCheekPosition,
        rightMouthPosition,
        noseBasePosition,
      } = faces[0];

      setPosGroup({
        leftEar: toFloorPos(leftEarPosition.x, leftEarPosition.y),
        leftEye: toFloorPos(leftEyePosition.x, leftEyePosition.y),
        leftCheek: toFloorPos(leftCheekPosition.x, leftCheekPosition.y),
        leftMouth: toFloorPos(leftMouthPosition.x, leftMouthPosition.y),
        rightEar: toFloorPos(rightEarPosition.x, rightEarPosition.y),
        rightEye: toFloorPos(rightEyePosition.x, rightEyePosition.y),
        rightCheek: toFloorPos(rightCheekPosition.x, rightCheekPosition.y),
        rightMouth: toFloorPos(rightMouthPosition.x, rightMouthPosition.y),
        noseBase: toFloorPos(noseBasePosition.x, noseBasePosition.y),
      });
    }
  };

  const renderPosPoint = (x: number, y: number): ReactElement => {
    return (
      <View
        style={{
          ...styles.defaultPos,
          left: x,
          top: y,
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Camera
        style={{ flex: 1 }}
        type={"front"}
        onFacesDetected={handleDetectedFaces}
        faceDetectorSettings={{
          mode: FaceDetector.Constants.Mode.fast,
          detectLandmarks: FaceDetector.Constants.Landmarks.all,
          runClassifications: FaceDetector.Constants.Classifications.all,
          minDetectionInterval: 0,
          tracking: true,
        }}
      >
        {posGroup && (
          <View style={styles.cameraContainer}>
            {renderPosPoint(posGroup.leftEar.x, posGroup.leftEar.y)}
            {renderPosPoint(posGroup.leftEye.x, posGroup.leftEye.y)}
            {renderPosPoint(posGroup.leftCheek.x, posGroup.leftCheek.y)}
            {renderPosPoint(posGroup.leftMouth.x, posGroup.leftMouth.y)}
            {renderPosPoint(posGroup.rightEar.x, posGroup.rightEar.y)}
            {renderPosPoint(posGroup.rightEye.x, posGroup.rightEye.y)}
            {renderPosPoint(posGroup.rightCheek.x, posGroup.rightCheek.y)}
            {renderPosPoint(posGroup.rightMouth.x, posGroup.rightMouth.y)}
            {renderPosPoint(posGroup.noseBase.x, posGroup.noseBase.y)}
          </View>
        )}
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    position: "relative",
  },
  defaultPos: {
    width: 15,
    height: 15,
    borderRadius: 15,
    position: "absolute",
    backgroundColor: "red",
  },
});
