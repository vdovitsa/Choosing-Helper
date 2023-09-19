let images = [];
let items = [];
let winners = [];
let currentPair = [];
let inputArea = document.getElementById('input-area');
let startButton = document.getElementById('start-button');
let itemsList = document.getElementById('items-list');
let tournamentItem1 = document.getElementById('tournament-item1');
let tournamentItem2 = document.getElementById('tournament-item2');
let imgPreview = document.getElementById('img-preview');
let firstFilePreview = document.getElementById('first-file-preview');
let secondFilePreview = document.getElementById('second-file-preview');
let fileCountElement = document.getElementById('file-count');
let previewArea= document.getElementById('preview-area');
let textContent= document.getElementById('text-content');


inputArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
    inputArea.style.backgroundColor = '#e5e5e5';
    inputArea.innerHTML = '<p>Just Drop It, cmon</p>';
    inputArea.classList.add('dragging');
});

inputArea.addEventListener('dragleave', function(e) {
    e.preventDefault();
    e.stopPropagation();
    inputArea.style.backgroundColor = '';
    inputArea.innerHTML = '<p>Drag and drop files or click to start typing</p>';
    inputArea.classList.remove('dragging');
});

inputArea.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
    images = Array.from(e.dataTransfer.files);
    inputArea.style.display = 'none';
    document.getElementById('preview-area').style.display = 'flex';
    document.getElementById('file-count').style.display = 'flex';
    document.getElementById('first-file-preview').style.display = 'flex';
    document.getElementById('second-file-preview').style.display = 'flex';
   
    let files = e.dataTransfer.files;
    updatePreviewAndCount(files);

    checkStartButtonState();
});

inputArea.addEventListener('click', function() {
    if (!document.getElementById('text-input')) {
        inputArea.innerHTML = '<input type="text" id="text-input" placeholder="Start typing...">';
        itemsList.style.display = 'flex';  
        
        let textInput = document.getElementById('text-input');
        textInput.focus();
        textInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && textInput.value.trim() !== '') {
               
                
                items.push(textInput.value);
                let newItem = document.createElement('div');
              
    newItem.textContent = textInput.value;
    itemsList.appendChild(newItem);
                textInput.value = '';
                checkStartButtonState();
            }
        });
    }
});

startButton.addEventListener('click', function() {
    itemsList.style.display = 'none';
    inputArea.style.display = 'none';
    startButton.style.display = 'none';
    firstFilePreview.style.display = 'none';
    secondFilePreview.style.display = 'none';
    fileCountElement.style.display = 'none';
    previewArea.style.display = 'none';

    document.getElementById('tournament-area').style.display = 'flex';
    nextMatch();
});

tournamentItem1.addEventListener('click', function() {
    winners.push(currentPair[0]);
    nextMatch();
});

tournamentItem2.addEventListener('click', function() {
    winners.push(currentPair[1]);
    nextMatch();
});

function checkStartButtonState() {
    let totalItems = images.length + items.length;
    if (totalItems >= 2) {
        startButton.style.display = 'block';
    } else {
        startButton.style.display = 'none';
    }
}

function nextMatch() {
    if (images.length === 0 && items.length === 0) {
        if (winners.length === 1) {
            document.getElementById('tournament-area').style.display = 'none';
            document.getElementById('winner-area').style.display = 'flex';
            document.getElementById('h').style.display = 'flex';
            if (typeof winners[0] === 'string') {
                document.getElementById('winner-item').innerHTML = '<div class="text-content">' + (winners[0]) + '</div>';
                
            } else {
                document.getElementById('winner-item').innerHTML = '<img src="' + URL.createObjectURL(winners[0]) + '">';
            }
        } else {
            images = images.concat(winners.filter(item => item instanceof File));
            items = items.concat(winners.filter(item => typeof item === 'string'));
            winners = [];
            nextMatch();
        }
    } else if (images.length === 1 || items.length === 1) {
        let soloItem = images.length === 1 ? images.pop() : items.pop();
        winners.push(soloItem);
        nextMatch();
    } else {
        if (images.length > 0) {
            currentPair = [images.pop()];
            tournamentItem1.innerHTML = '<img src="' + URL.createObjectURL(currentPair[0]) + '">';
        } else {
            currentPair = [items.pop()];
           
            // tournamentItem1.textContent = currentPair[0];
            // tournamentItem1.classList.toggle("text-content");
            tournamentItem1.innerHTML = '<div class="text-content">' + (currentPair[0]) + '</div>';
           
        }

        if (images.length > 0) {
            currentPair.push(images.pop());
            tournamentItem2.innerHTML = '<img src="' + URL.createObjectURL(currentPair[1]) + '">';
        } else {
            currentPair.push(items.pop());
            // tournamentItem2.textContent = currentPair[1];
            // tournamentItem2.classList.add("text-content");
            tournamentItem2.innerHTML = '<div class="text-content">' + (currentPair[1]) + '</div>';
        }
    }
}
function updatePreviewAndCount(files) {
    if (files.length > 0) {
        // Update the preview with the first file
        let reader = new FileReader();
        reader.onload = function(e) {
            firstFilePreview.src = e.target.result;
        };
    reader.readAsDataURL(files[0]);
    }
    if (files.length > 1) {
        // Update the preview with the second file
        let reader = new FileReader();
        reader.onload = function(e) {
            secondFilePreview.src = e.target.result;
        };
        reader.readAsDataURL(files[1]);
    }

        // Update the file count
        fileCountElement.textContent = `${files.length} ${files.length > 1 ? '' : ''}`;
    }
  