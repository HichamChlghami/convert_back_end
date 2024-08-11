FROM node:22

# Set the working directory
WORKDIR /app

# Update npm to the latest version
RUN npm install -g npm@latest

# Clean npm cache
# RUN npm cache clean --force

# Copy package.json and package-lock.json
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Install LibreOffice
RUN apt-get update && \
    apt-get install -y libreoffice && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


# Copy the rest of the application code
COPY . .

# Update package list and install python3 and necessary tools including apt-utils
RUN apt-get update && apt-get install -y \
    apt-utils \
    python3 \
    python3-pip \
    python3-venv

# Create a virtual environment
RUN python3 -m venv venv

# Set the path to use the virtual environment
ENV PATH="/app/venv/bin:$PATH"

# Upgrade pip
RUN pip install --upgrade pip

# Install python dependencies
RUN pip install -r requirements.txt

# Set environment variables
ENV PORT=8080

# Expose the port the app runs on
EXPOSE 8080

# Start the application
CMD ["npm", "start"]






# # Use the official Node.js image as the base image
# FROM node:22

# # Set the working directory
# WORKDIR /app

# # Copy package.json and package-lock.json first to utilize Docker cache
# COPY package*.json ./

# # Install system dependencies required by canvas
# RUN apt-get update && apt-get install -y \
#     build-essential \
#     libcairo2-dev \
#     libpango1.0-dev \
#     libjpeg-dev \
#     libgif-dev \
#     librsvg2-dev

# # Install npm dependencies
# RUN npm install

# # Copy the rest of the application code
# COPY . .

# # Install ffmpeg
# RUN apt-get update && apt-get install -y ffmpeg

# # Update package list and install python3 and necessary tools including apt-utils
# RUN apt-get update && apt-get install -y \
#     apt-utils \
#     python3 \
#     python3-pip \
#     python3-venv

# # Create a virtual environment
# RUN python3 -m venv venv

# # Set the path to use the virtual environment
# ENV PATH="/app/venv/bin:$PATH"

# # Upgrade pip
# RUN pip install --upgrade pip

# # Install python dependencies
# RUN pip install -r requirements.txt

# # Set environment variables
# ENV PORT=8080

# # Expose the port the app runs on
# EXPOSE 8080

# # Start the application
# CMD ["npm", "start"]
