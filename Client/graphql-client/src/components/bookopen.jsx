import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function BookOpen() {
	const mountRef = useRef(null);
	const trophyRef = useRef(null);

	useEffect(() => {
		// Scene, Camera, Renderer
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			mountRef.current.clientWidth / mountRef.current.clientHeight,
			0.1,
			100
		);
		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // Enable alpha for transparency
		renderer.setSize(
			mountRef.current.clientWidth,
			mountRef.current.clientHeight
		);
		renderer.setClearColor(0x000000, 0); // Transparent background (black with alpha 0)
		mountRef.current.appendChild(renderer.domElement);

		// Lighting
		const ambientLight = new THREE.AmbientLight(0x404040, 2); // Increased light intensity
		scene.add(ambientLight);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(5, 5, 5).normalize();
		scene.add(directionalLight);

		// Load the Trophy Model
		const loader = new GLTFLoader();
		loader.load(
			"/models3D/book_open/scene.gltf",
			(gltf) => {
				const model = gltf.scene;
				trophyRef.current = model; // Store reference to the model

				// Center and scale the model
				const box = new THREE.Box3().setFromObject(model);
				const center = box.getCenter(new THREE.Vector3());
				const size = box.getSize(new THREE.Vector3());
				const maxDim = Math.max(size.x, size.y, size.z);
				const scale = 5 / maxDim;

				model.scale.set(scale, scale, scale);
				model.position.sub(center.multiplyScalar(scale)); // Center at origin
				model.rotation.y = Math.PI / 4; // Initial rotation

				scene.add(model);
				console.log("GLTF model loaded:", model);
				console.log("Model bounding box:", box);
				console.log("Model scale applied:", scale);
			},

			(xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
			(error) => console.error("Error loading GLTF model:", error)
		);

		// Camera position and focal length
		camera.position.set(-6, 2, 5);
		camera.lookAt(0, 0, 0);
		camera.focalLength = 15;

		// Light pointing from the camera to the trophy
		const cameraLight = new THREE.PointLight(0xffffff, 1000);
		cameraLight.position.copy(camera.position);
		scene.add(cameraLight);

		// Animate the Scene
		const animate = () => {
			requestAnimationFrame(animate);
			if (trophyRef.current) {
				trophyRef.current.rotation.y += 0.01; // Rotate only the trophy in place
				const box = new THREE.Box3().setFromObject(trophyRef.current);
				const center = box.getCenter(new THREE.Vector3());
				trophyRef.current.position.sub(center); // Move to origin
				trophyRef.current.position.applyAxisAngle(
					new THREE.Vector3(0, 1, 0),
					0.01
				); // Rotate around Y axis
				trophyRef.current.position.add(center); // Move back to original position
			}
			renderer.render(scene, camera);
		};
		animate();

		// Cleanup
		return () => {
			// Check if mountRef.current exists before cleanup
			if (mountRef.current) {
				while (mountRef.current.firstChild) {
					mountRef.current.removeChild(mountRef.current.firstChild);
				}
			}
		};
	}, []);

	return <div ref={mountRef} style={{ width: "400px", height: "400px" }} />;
}

export default BookOpen;
