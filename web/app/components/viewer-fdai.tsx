import * as THREE from 'three'
import {createRoot} from 'react-dom/client'
import React, {useRef, useState, ComponentProps, useEffect} from 'react'
import {Canvas, useFrame, ThreeElements, useLoader, useThree} from '@react-three/fiber'
import {Texture, TextureLoader} from "three";


const ViewerFdai = (props: ComponentProps<any>) => {
    const [textureFdai, setTextureFdai] = useState(new Texture());
    const [textureFd, setTextureFd] = useState(new Texture());

    const ref = useRef<THREE.Mesh>(null!);
    const quaternion = new THREE.Quaternion();
    const maxAnisotropy = useThree((state) => state.gl.capabilities.getMaxAnisotropy());

    useEffect(() => {
        let texture_temp = new TextureLoader().load('fdai.png')
        texture_temp.anisotropy = maxAnisotropy;
        setTextureFdai(texture_temp);

        texture_temp = new TextureLoader().load('fd.png')
        texture_temp.anisotropy = maxAnisotropy;
        setTextureFd(texture_temp);
    }, [])

    useFrame((state, delta) => {
        ref.current.setRotationFromQuaternion(quaternion.fromArray(props.quat).normalize());
    })

    return (
        <group>
            <mesh ref={ref} position={[0, 0, 0]} rotation={[-Math.PI/2, Math.PI/2, 0]}>
                <sphereGeometry args={[2, 48, 32]}/>
                <meshBasicMaterial map={textureFdai}/>
            </mesh>
            <sprite scale={[5.2,5.2,0]}>
                <spriteMaterial map={textureFd} depthTest={false}/>
            </sprite>
        </group>
    );
}

export default ViewerFdai;