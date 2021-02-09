export default function changePipeToClouds(sortingBoard) {
  sortingBoard.classList.add("merge-container");
  const pipes = document.querySelectorAll(".pipe");

  pipes.forEach(pipe => {
    pipe.classList.add("number-cloud");
    pipe.classList.add("mergeChart");
    pipe.style.height = "100px";
    pipe.style.width = "100px";
  });

  const clouds = document.querySelector(".clouds-container");
  clouds.classList.add("hidden");
}
