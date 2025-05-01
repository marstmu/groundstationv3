import * as THREE from 'three'
import {createRoot} from 'react-dom/client'
import React, {useRef, useState, ComponentProps} from 'react'
import {Canvas, useFrame, ThreeElements} from '@react-three/fiber'


const ViewerRocket = (props: ComponentProps<any>) => {
    const ref = useRef<THREE.Mesh>(null!)
    const quaternion = new THREE.Quaternion()

    useFrame((state, delta) => {
        ref.current.setRotationFromQuaternion(quaternion.fromArray(props.quat).normalize());
    })

    return (
        <mesh ref={ref} position={[0, 0, 0]}>
            <boxGeometry args={[2, 2, 2]}/>
            <meshStandardMaterial color='orange'/>
        </mesh>
    );
}

export default ViewerRocket;