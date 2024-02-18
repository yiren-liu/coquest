<a name="readme-top"></a>


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="images/icon.jpg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">CoQuest: Agent LLM for Research Question Co-Creation</h3>

  <p align="center">
    This is the code for the system introduced in SIGCHI 2024 paper <a href="https://arxiv.org/abs/2310.06155">"CoQuest: Exploring Research Question Co-Creation with an LLM-based Agent"</a>.
  </p>
</div>




<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Screen Shot][product-screenshot]](https://github.com/yiren-liu/coquest)

We proposed a novel system called CoQuest, which allows an AI agent to initiate research question (RQ) generation by tapping the power of LLMs and taking humans' feedback into a co-creation process.

Major features of the CoQuest system:
* ***RQ Flow Editor*** that facilitates a user’s major interactions, such as generating RQs, providing input and feedback to AI, and editing the RQ flow (e.g., drag and delete).
* ***Paper Graph Visualizer*** that displays the literature space related to each RQ.
* ***AI Thoughts*** that explains AI’s rationale of why each RQ is generated.

[![System Framework][system-framework]](https://github.com/yiren-liu/coquest)

<p align="right">(<a href="#readme-top">back to top</a>)</p>


#### Demo Video
![Demo Video](https://drive.google.com/file/d/1nK-T4aHCTxBdPXBs-ADs273yPEPulwi_/view?usp=sharing)

### Built With

We thankfully acknowledge the following projects/libraries based on the which this prototype is made possible. 

* [![FastAPI][FastAPI]][FastAPI-url]
* [![React][React.js]][React-url]
* xyflow: https://github.com/xyflow/xyflow
* AutoGPT: https://github.com/Significant-Gravitas/AutoGPT
* LangFlow: https://github.com/logspace-ai/langflow 


<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

**Recommended:** Install Docker (https://docs.docker.com/get-docker/) and docker-compose. 

Alternatively, to install from source, you would need to install Node.js and Python>=3.10.

### Installation

#### Adding API configs
This is required for both running from docker or source.

1. First create a config file ```backend/.env``` based on your API choice and info. Refer to the ```backend/.env.example``` for an example.

2. IF you are using Azure OpenAI API, create another Azure config file at ```backend/azure.yaml```. Refer to the ```backend/azure.yaml.example``` for an example.


#### From docker (Recommended)

1. To deploy locally, build and run docker containers with docker-compose (Note that this runs a DEV server)
  ```sh
  docker-compose up
  ```


#### From source
1. Clone the repo
  ```sh
  git clone https://github.com/yiren-liu/coquest.git
  ```
2. Install and run server for the frontend
  ```sh
  cd frontend/rq-flow
  npm install
  npm start
  ```
3. Install backend Python server requirements
  ```sh
  cd backend/
  pip install -r requirements.txt
  python -m spacy download en_core_web_sm
  ```
4. Run backend server (Dev mode)
  ```sh
  python main.py
  ```

The backend DB for logging change be changed to any self-hosted postgres DB by modifying the ```.env``` configs. 

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

After deploying the service locally, visit: http://localhost:3000/app

### Replacing the paper pool with your own
The paper pool used in the search function is vectorized and stored using ChromaDB under ```backend/paper_graph/db```. 
Currently, the embedding model we used is OpenAI Ada 2, but you could use any other models if needed. When swapping the paper pool, modify and run the ```backend/paper_graph/get_embeddings.py```.


<p align="right">(<a href="#readme-top">back to top</a>)</p>





<!-- CONTACT -->
## Contact

Yiren Liu - [@yirenl2](https://twitter.com/yirenl2) - yirenl2@illinois.edu

SALT Lab @ UIUC: [https://socialcomputing.web.illinois.edu/index.html](https://socialcomputing.web.illinois.edu/index.html)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=for-the-badge
[license-url]: https://github.com/yiren-liu/coquest/blob/master/LICENSE
[product-screenshot]: images/system_interface.png
[system-framework]: images/framework.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[FastAPI]: https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi
[FastAPI-url]: https://fastapi.tiangolo.com/