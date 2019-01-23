# Use an existing node image provided by Docker as our initial snapshot
# to build FROM:
FROM node:10

# Create a directory for our files. 
# It is a path that will be created if it does not exist
WORKDIR /martin-reviews

# Bundle and copy the source files (this includes package.json):
COPY . .

ARG PORT=3002
ENV PORT=$PORT

# Initialize node packages within our image build
RUN npm install

# Expose the port that our app will use
EXPOSE 3002 9001

# Run the script from our package.json when our container is run
CMD ["npm","start"]