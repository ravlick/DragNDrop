
Number.prototype.clamp = function (min, max) {
    return Math.max(min, Math.min(max, this));
};

HTMLElement.prototype.canDrag = function (value) {

    let self = this;
    self.dragState = {
        isDrag: false,
        offsetX: 0,
        offsetY: 0,
        isDragStarted: false
    };

    if (value) {
        this.isDraggable = true;
        this.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("mousemove", onMousePress)

    } else {
        this.isDraggable = false;
        this.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mouseup", onMouseUp);
        window.removeEventListener("mousemove", onMousePress);
    }

    function onMouseDown (e) {
        if (e.which === 1 && self.isDraggable) {

            self.dragState.isDrag = true;
            self.dragState.offsetX = e.pageX - self.offsetLeft;
            self.dragState.offsetY = e.pageY - self.offsetTop;

            self.style.pointerEvents = "none";
        }
    }

    function onMouseUp(e) {
        if (self.dragState.isDrag) {
            self.dispatchEvent(new Event("selfdragend"));
            e.target.dispatchEvent(new CustomEvent("acceptitem", {'detail': self} ));
            self.style.pointerEvents = "all";
        }
        self.dragState.isDrag = false;
        self.dragState.isDragStarted = false;
    }

    function onMousePress(e) {
        if (self.dragState.isDrag && e.which === 1){

            let dx = e.pageX - self.dragState.offsetX;
            let dy = e.pageY - self.dragState.offsetY;

            dx = dx.clamp(0, window.innerWidth);
            dy = dy.clamp(0, window.innerHeight);

            self.style.left = dx + "px";
            self.style.top = dy + "px";

            if (self.dragState.isDragStarted === false) {
                self.dragState.isDragStarted = true;
                self.dispatchEvent(new Event("selfdragstart"));
            }

            self.dispatchEvent(new Event("selfdrag"));
        }
    }

};


