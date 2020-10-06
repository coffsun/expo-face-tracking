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
  const [hasPermission, setHasPermission] = useState<any>(null);
  const [posGroup, setPosGroup] = useState<posGroupType | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const floor = (num: number): number => {
    return Math.floor(num);
  };

  const handleDetectFace = ({ faces }: any) => {
    if (faces && faces[0]) {
      const val = faces[0];

      setPosGroup({
        leftEar: {
          x: floor(val.leftEarPosition.x),
          y: floor(val.leftEarPosition.y),
        },
        leftEye: {
          x: floor(val.leftEyePosition.x),
          y: floor(val.leftEyePosition.y),
        },
        leftCheek: {
          x: floor(val.leftCheekPosition.x),
          y: floor(val.leftCheekPosition.y),
        },
        leftMouth: {
          x: floor(val.leftMouthPosition.x),
          y: floor(val.leftMouthPosition.y),
        },
        rightEar: {
          x: floor(val.rightEarPosition.x),
          y: floor(val.rightEarPosition.y),
        },
        rightEye: {
          x: floor(val.rightEyePosition.x),
          y: floor(val.rightEyePosition.y),
        },
        rightCheek: {
          x: floor(val.rightCheekPosition.x),
          y: floor(val.rightCheekPosition.y),
        },
        rightMouth: {
          x: floor(val.rightMouthPosition.x),
          y: floor(val.rightMouthPosition.y),
        },
        noseBase: {
          x: floor(val.noseBasePosition.x),
          y: floor(val.noseBasePosition.y),
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={{ flex: 1 }}
        type={"front"}
        onFacesDetected={handleDetectFace}
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
            <View
              style={{
                ...styles.defaultPos,
                top: posGroup.leftEar.y,
                left: posGroup.leftEar.x,
              }}
            />
            <View
              style={{
                ...styles.defaultPos,
                top: posGroup.leftEye.y,
                left: posGroup.leftEye.x,
              }}
            />
            <View
              style={{
                ...styles.defaultPos,
                top: posGroup.leftCheek.y,
                left: posGroup.leftCheek.x,
              }}
            />
            <View
              style={{
                ...styles.defaultPos,
                top: posGroup.leftMouth.y,
                left: posGroup.leftMouth.x,
              }}
            />
            <View
              style={{
                ...styles.defaultPos,
                top: posGroup.rightEar.y,
                left: posGroup.rightEar.x,
              }}
            />
            <View
              style={{
                ...styles.defaultPos,
                top: posGroup.rightEye.y,
                left: posGroup.rightEye.x,
              }}
            />
            <View
              style={{
                ...styles.defaultPos,
                top: posGroup.rightCheek.y,
                left: posGroup.rightCheek.x,
              }}
            />
            <View
              style={{
                ...styles.defaultPos,
                top: posGroup.rightMouth.y,
                left: posGroup.rightMouth.x,
              }}
            />
            <View
              style={{
                ...styles.defaultPos,
                top: posGroup.noseBase.y,
                left: posGroup.noseBase.x,
              }}
            />
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
