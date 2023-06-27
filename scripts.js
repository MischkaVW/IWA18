import * as dataFile from "./data.js"; 
import * as viewFile from "./view.js"; 


/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event 
 */

const handleDragStart = (event) => {
    event.preventDefault(); 

}


const handleDragOver = (event) => {
   handleDragStart()
   viewFile.updateDraggingHtml()
    const path = event.path || event.composedPath()
  
    let column = null 

    for (const element of path) {  

        const { area } = element.dataset 
        if (area) { 
            column = area
            break;
        }
    }
 
    if (!column) return
    updateDragging({ over: column })
    updateDraggingHtml({ over: column })
}



const handleDragEnd = (event) => {
   event.preventDefault();
    handleDragOver();
}


const handleHelpToggle = (event) => {
    viewFile.html.help.overlay.show()
    event.preventDefault(); 
  
}


const handleHelpCancelToggle = (event) => {
   event.preventDefault(); 
    viewFile.html.help.overlay.close();
 };



const handleAddToggle = (event) => {
    viewFile.html.add.overlay.show()
  
   
    const path = event.path || event.composedPath()
    let order = null
    
    for (const element of path) { 

        const { add } = element.dataset 
        if (add) { 
            order = add
            break;
        }
    }

    
    
    event.target.reset();
    
}


const handleCancelToggle = (event) => {
    event.preventDefault(); 
    viewFile.html.add.overlay.close();
}

const handleAddSubmit = (event) => {  
    event.preventDefault();
    const overlay = viewFile.html.add.overlay;
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries()); 
    const newData = dataFile.createOrderData(data);
    const htmlData = viewFile.createOrderHtml(newData);
    const append = document.querySelector('[data-area="ordered"]');
    event.target.reset();
    overlay.close();
    append.appendChild(htmlData);
 };



const handleEditToggle = (event) => {
    viewFile.html.edit.overlay.show();
    event.preventDefault(); 
    
}

const handleEditSubmit = (event) => {
    event.preventDefault();
    const overlay = viewFile.html.edit.overlay;
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries()); 
    const newData = viewFile.moveToColumn(data);
    const append = document.querySelector('.grid');
    event.target.reset();
    overlay.close();
    append.appendChild(newData);
  };

  const handleEditClose = (event) => {
    event.preventDefault();
    viewFile.html.edit.overlay.close()
}
  


const handleDelete = (event) => {
    event.preventDefault();
    viewFile.html.edit.overlay.delete() 
}

viewFile.html.add.cancel.addEventListener('click', handleCancelToggle)
viewFile.html.other.add.addEventListener('click', handleAddToggle)
viewFile.html.add.form.addEventListener('submit', handleAddSubmit)

viewFile.html.other.grid.addEventListener('click', handleEditToggle)
viewFile.html.edit.cancel.addEventListener('click', handleEditClose)
viewFile.html.edit.form.addEventListener('submit', handleEditSubmit)
viewFile.html.edit.delete.addEventListener('click', handleDelete)

viewFile.html.help.cancel.addEventListener('click', handleHelpCancelToggle )
viewFile.html.other.help.addEventListener('click', handleHelpToggle)

for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener('dragstart', handleDragStart)
    htmlColumn.addEventListener('dragend', handleDragEnd)
}

for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener('dragover', handleDragOver)
}