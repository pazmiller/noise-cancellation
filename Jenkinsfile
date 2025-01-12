pipeline {
    agent any

    environment {
        // 1) 使用 Jenkins 中的 "Secret file" / "Username & password" / "Google Service Account" 凭据
        // 这里“gcp-artifact-key”是你在 Credentials 里设置的 ID，映射到 GOOGLE_APPLICATION_CREDENTIALS
        GOOGLE_APPLICATION_CREDENTIALS = credentials('gcp-artifact-key')
        
        // 2) 下面这些根据实际情况填写
        GCP_PROJECT_ID = "jenkins-services"
        GCP_REGION = "asia-southeast1"             // 你的 Artifact Registry 区域
        ARTIFACT_REPO = "my-electron-repo"     // 仓库名称
        IMAGE_NAME = "electron-noise"          // 你的镜像名称
        IMAGE_TAG = "latest"                   // 镜像Tag
    }

    stages {
        stage('Verify GCP Auth') {
            steps {
                sh '''
                    # 使用 Service Account 密钥进行身份认证
                    gcloud auth activate-service-account --key-file="$GOOGLE_APPLICATION_CREDENTIALS"
                    
                    # 配置当前 gcloud 的默认项目ID
                    gcloud config set project $GCP_PROJECT_ID
                    
                    # 列出 GCP Artifact Registry 仓库 (可确认权限/网络是否正常)
                    gcloud artifacts repositories list --location=$GCP_REGION
                '''
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    // 1) 先让 Docker 使用 gcloud 进行 Artifact Registry 的身份认证
                    sh """
                      gcloud auth configure-docker $GCP_REGION-docker.pkg.dev --quiet
                    """

                    // 2) 拼接 Artifact Registry 完整镜像名
                    def fullImageName = "${GCP_REGION}-docker.pkg.dev/${GCP_PROJECT_ID}/${ARTIFACT_REPO}/${IMAGE_NAME}:${IMAGE_TAG}"

                    // 3) 构建并推送 Docker 镜像
                    sh """
                      docker build -t ${fullImageName} .
                      docker push ${fullImageName}
                    """
                }
            }
        }
    }
}
