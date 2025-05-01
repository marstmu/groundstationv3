import * as THREE from 'three'
import {createRoot} from 'react-dom/client'
import React, {useRef, useState, ComponentProps} from 'react'
import {Canvas, useFrame, ThreeElements} from '@react-three/fiber'


const Viewer = (props: ComponentProps<any>) => {
    return (
        <Canvas camera={{position: [0, 3.5, 0]}} className={props.className}>
            <ambientLight intensity={0.1} />
            {/*<directionalLight position={[-1, 0.5, 1]} intensity={Math.PI} />*/}
            {/*<axesHelper/>*/}
            <spotLight position={[0, 3.5, 0]} intensity={5}/>
            {props.children}
        </Canvas>
    );
}

export default Viewer;