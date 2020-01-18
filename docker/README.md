# Getting started with the DRIVER+ test-bed

This folder gets you started with the DRIVER+ test-bed. It explains how to set-up the technical infrastructure, and how
to run a simple scenario. This composition contains the basic required images to run the Apache Kafka messaging
framework, as well as several tools that demonstrate the capabilities of how the test-bed can be used to run a scenario
(e.g. several management tools and a simulator).

This is basically a slimmed down version of the local-i4cm script.

## Preparation - LCMS Connector

To use the LCMS connector, please make sure that you have an account with admin rights in the LCMS test environment, i.e. it can create tabs, read and post messages, read plot data, etc. For more information, also see the [LCMS connector website](https://github.com/DRIVER-EU/lcms-connector).

In order to connect the test-bed to LCMS, create a `.env` file in this folder (next to `docker-compose.yml`). In that
file, add your login details for LCMS:

```console
LCMS_CONNECTOR_USERNAME=johndoe
LCMS_CONNECTOR_PASSWORD=1234
```

Additionally, you might need to change the default exercise name `Driver+ Test` (case sensitive) with another LCMS-exercise in the file `docker-compose.yml`, as the default exercise may not exist anymore (they are cleaned-up regularly), and it needs to exists before starting it. The parameter to change is `LCMS_CONNECTOR_EXCERCISE`.

## Installation

You should have installed Docker in order to run the test-bed. Next, see the LCMS section below to prepare it  To get started, clone and run the docker-composition:

```console
git clone https://github.com/DRIVER-EU/test-bed.git
cd test-bed\docker\local-ifv
docker-compose up -d
```

The first time it may take a while before all images are downloaded. Subsequently, it may take 1 or 2 minutes before all containers have finished their start-up process.

You can use the command line `docker ps` to see all processes running. Alternatively, you can install [DockStation](https://dockstation.io/) or, if you have [node.js](https://nodejs.org/en/) installed, you can install `npm i -g dockly` and run `dockly`.

## Tutorial - Running a scenario

Once the test-bed is up-and-running using the instructions above, let's get started with a demonstration of the
test-bed's capabilities. First of all, here is an overview of the running services and their links:

| Service                      | Port | Link                               |
| ---------------------------- | ---- | ---------------------------------- |
| Kafka & Zookeeper            | 3501 | -                                  |
| Kafka topics UI              | 3600 | http://localhost:3600              |
| Kafka schema registry and UI | 3601 | http://localhost:3601              |
| Time service                 | 8100 | http://localhost:8100/time-service |
| Admin tool                   | 8090 | http://localhost:8090              |
| After Action Review tool     | 8095 | http://localhost:8095              |
| Trial-Management-Tool        | 3210 | http://localhost:3210              |
| LCMS connector / gateway     | 8500 | http://localhost:8500              |
| Silent Producer              | -    | -                                  |

### Starting a trial

Browse to the [Admin-tool](http://localhost:8090) and initialize the test-bed by clicking on the 'Initialize
test-bed'-button. Similarly, start a trial with 'Start trial'.
![image1](https://user-images.githubusercontent.com/11523459/67579710-4ee5d500-f745-11e9-987b-ee62bcad5c18.png)

Then, open the [Trial Management Tool (TMT)](http://localhost:3210). Upload an exported Trial (e.g.
[sim-trial](https://github.com/DRIVER-EU/test-bed/files/3772536/trial_2f670b5c-6ec0-4b70-9e87-92252d305d6e.1.zip)) and
import it (see [here](#importing-a-trial)). Open this trial by clicking on the title ('sim-trial') and select the 'Run'
mode on the top-right.
![image2](https://user-images.githubusercontent.com/11523459/67581026-940b0680-f747-11e9-983b-80dfe36497f0.png) Next,
connect to the test-bed. Then start the session by clicking 'Start'.
![image3](https://user-images.githubusercontent.com/11523459/67581119-c74d9580-f747-11e9-8a5f-3d3573a4122b.png) When you have done this, an 'Initialize' button appears. Clicking this button will start the time.

## Screenshots

### Importing a trial

Open a browser window with the [Trial Management Tool (TMT)](http://localhost:3210) dashboard and click the green
'+'-button and then 'upload existing trial'.
![coppert2](https://user-images.githubusercontent.com/11523459/57529348-fc4e6300-7334-11e9-9afd-c939532a2548.jpg)
![coppert3](https://user-images.githubusercontent.com/11523459/57529350-fd7f9000-7334-11e9-82de-c413833e1b0e.jpg)
