# Zero administration inference with AWS Lambda for :hugs:

The code and the rest of this document is based heavily on a tutorial from the [AWS Compute Blog](https://aws.amazon.com/blogs/compute/hosting-hugging-face-models-on-aws-lambda/)

### Note: This is not production code and simply meant as a demo

## Overview

This is a [AWS Cloud Development
Kit](https://aws.amazon.com/cdk/) (AWS CDK) script that automatically
provisions container image-based Lambda functions that perform ML
inference using pre-trained models. This solution also
includes [Amazon Elastic File System](https://aws.amazon.com/efs/) (EFS)
storage that is attached to the Lambda functions to cache the
pre-trained models and reduce inference latency.

![Architecture diagram](serverless-hugging-face.png)
In this architectural diagram:
1.  Serverless inference is achieved by using Lambda functions that are
    based on container image
2.  The container image is stored in an [Amazon Elastic Container
    Registry](https://aws.amazon.com/ecr/) (ECR) repository within your
    account
3.  Pre-trained models are automatically downloaded from Hugging Face
    the first time the function is invoked
4.  Pre-trained models are cached within Amazon Elastic File System
    storage in order to improve inference latency

## Prerequisites
The following is required to run this example:
-   [git](https://git-scm.com/)
-   [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html)
-   [Python](https://www.python.org/) 3.6+
-   [A virtual env](https://docs.python.org/3/library/venv.html#module-venv) (optional)

## Deploying the example application
1.  Clone the project to your development environment and navigate to this directory. 
2.  Install the required dependencies:
```bash
pip install -r requirements.txt
```
3.  Bootstrap the CDK. This command provisions the initial resources
    needed by the CDK to perform deployments:
```bash
cdk bootstrap
```
4.  This command deploys the CDK application to its environment. During
    the deployment, the toolkit outputs progress indications:
```bash
cdk deploy
```
5. You should now have a deployed AWS Lambda function. Connect it to an HTTP API in the [AWS API Gateway](https://us-west-2.console.aws.amazon.com/apigateway/main/apis?region=us-west-2) and enable CORS so the chrome extension can access the API. 

## Understanding the code structure
The code is organized using the following structure:
```bash
├── inference
│   ├── Dockerfile
│   └── translate.py
├── app.py
└── ...
```

The ```inference``` directory contains:
-   The ```Dockerfile``` used to build a custom image to be able to run PyTorch Hugging Face inference using Lambda functions
-   The Python scripts that perform the actual ML inference

The ```translate.py``` script shows how to use Hugging Face Transformers
models to convert between Chinese and English, as well as the jiagu library for Chinese word segmentation. The vocab list in the file comes from [HSK Academy](https://hsk.academy/en/hsk-1-vocabulary-list). 

For each Python script in the inference directory, the CDK generates a
Lambda function backed by a container image and a Python inference
script.

## CDK script
The CDK script is named ```app.py``` in the solution's repository. The
beginning of the script creates a virtual private cloud (VPC).
```python
vpc = ec2.Vpc(self, 'Vpc', max_azs=2)
```
Next, it creates the EFS file system and an access point in EFS for the
cached model:
```python
fs = efs.FileSystem(self, 'FileSystem',
vpc=vpc,
removal_policy=cdk.RemovalPolicy.DESTROY)
access_point = fs.add_access_point('MLAccessPoint',
create_acl=efs.Acl(
owner_gid='1001', owner_uid='1001', permissions='750'),
path="/export/models",
posix_user=efs.PosixUser(gid="1001", uid="1001"))
```
It iterates through the Python files in the inference directory:
```python
docker_folder = os.path.dirname(os.path.realpath(__file__)) + "/inference"
pathlist = Path(docker_folder).rglob('*.py')
for path in pathlist:
```
And then creates the Lambda function that serves the inference requests:
```python
base = os.path.basename(path)
filename = os.path.splitext(base)[0]
# Lambda Function from docker image
function = lambda_.DockerImageFunction(
    self, filename,
    code=lambda_.DockerImageCode.from_image_asset(docker_folder,
    cmd=[filename+".handler"]),
    memory_size=8096,
    timeout=cdk.Duration.seconds(600),
    vpc=vpc,
    filesystem=lambda_.FileSystem.from_efs_access_point(
    access_point, '/mnt/hf_models_cache'),
    environment={
        "TRANSFORMERS_CACHE": "/mnt/hf_models_cache"},
    )
```

## Cleaning up
After you are finished experimenting with this project, run ```cdk destroy``` to remove all of the associated infrastructure.

## License
This library is licensed under the MIT No Attribution License. See the [LICENSE](LICENSE) file.
Disclaimer: Deploying the demo applications contained in this repository will potentially cause your AWS Account to be billed for services.