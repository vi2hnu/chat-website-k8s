# Real-Time Chat App (MERN + Socket.IO on Kubernetes)

## Overview
This is a real-time chat application built with the **MERN stack** (MongoDB, Express, React, Node.js) and **Socket.IO** for WebSocket-based communication.

![Image](https://github.com/user-attachments/assets/bfa506e1-fe3f-4863-89ed-646f4f70e8c0)

## Website
![Image](https://github.com/user-attachments/assets/ae979750-f54c-40e1-9c65-321e3d53c851)

![Image](https://github.com/user-attachments/assets/745c2455-9ec3-4075-92a3-b25d7a668f9a)

### Tech Stack
- **React**: Frontend
- **Express js**: Backend
- **MongoDB**: Database
- **SocketIO**: Websocket

## Kubernetes Deployment
The application is fully containerized and deployed on **Kubernetes**, using **Helm charts** to manage deployments, services, and ingress configurations. It features:

- Scalable backend and frontend services
- WebSocket support via NGINX Ingress
- JWT-based authentication
- Secrets and environment values managed through Helm

This setup reflects a production-style architecture for real-time applications on Kubernetes.
Without any changes the cluster has 2 deployments with 2 internal service attached to them. The backend deployment has 2 pods and the frontend deployment has 1 pod. The ingress controller is configured to host "http://chat-app.com". For any changes please change the values in /helm/values.yaml.

![Image](https://github.com/user-attachments/assets/5cff71c9-bf85-4300-a7b5-10d0c25b672d)