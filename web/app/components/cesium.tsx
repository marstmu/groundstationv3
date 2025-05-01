import {Cesium3DTileset, CesiumComponentRef, CesiumWidget, Viewer} from 'resium'
import {CesiumWidget as cCesiumWidget} from "cesium"
import {ComponentProps, useCallback, useEffect, useRef} from 'react'

const map = (props: ComponentProps<any>) => {
    const ref = useRef<CesiumComponentRef<cCesiumWidget>>(null!);

    useCallback(() => {
        console.log(typeof(ref.current));
        if (ref.current?.cesiumElement) {
            ref.current.cesiumElement.scene.globe.show = false;
            console.log("ya");
        }
    }, []);

    return (
        <CesiumWidget ref={ref}>
            <Cesium3DTileset url="https://tile.googleapis.com/v1/3dtiles/root.json?key=AIzaSyBGCl_8caDFR__44YbmCadb6a4rT5G9zds" showCreditsOnScreen={true}/>
        </CesiumWidget>
    )
}

export default map;