const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  let repository = repositories.find(repo => id === repo.id);

  if (!repository) {
    return response.status(400).json({ error: 'This repository does not exists' });
  }

  repository = {
    ...repository,
    title,
    url,
    techs
  }

  repositories.push([...repositories, repository]);

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => id === repo.id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'This repository does not exists' });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => id === repo.id);

  const repository = repositories.find(repo => id === repo.id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'This repository does not exists' });
  }

  repositories[repositoryIndex] = { ...repository, likes: repository.likes + 1 };

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
