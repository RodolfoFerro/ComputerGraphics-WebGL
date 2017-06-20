# ComputerGraphics-WebGL: Final Project

This repository contains my final project on the subject computer graphics, taught by [Claudia Esteves, PhD.](http://cimat.mx/~cesteves/), at the [University of Guanajuato](http://www.ugto.mx).

## Requirements

* An updated version of a web browser is needed to compile and render WebGL.
* [`glMatrix`](http://glmatrix.net), which is a Javascript Matrix and Vector library for High Performance WebGL apps.
* External `.json` meshes with textures to render.

(Basically in this repo all of this is included already, what is really needed is the updated browser.)

## Instructions:

You can download/clone this repository and run a specific folder using a local server with Python. The way to do this (for Python 3.x) is as follows:

1. Clone/download this repo.
2. Launch your terminal.
3. Browser until you get in the repo folder.
4. `cd` the folder you want to run.
5. Run `python -m http.server`.
6. Open your web browser and go to `localhost:8000`.

You're now able to see the render of the respective WebGL scriptcontained in that folder.

#### Check all the renders at once in the [website I built](https://rodolfoferro.github.io/ComputerGraphics-WebGL/).


## How it works?

The web browser compiles the WebGL scripts contained in the folders, with its vertex and fragment shaders. This simplifies the job to be done, since many errors can be found by programming in OpenGL using C++.

Check a detailed explanation of all the code (and project itself) in the following Youtube video:
