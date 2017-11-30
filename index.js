class Drag {
	constructor (options) {
		this.options = options || {};

		this.init = this.init.bind(this);
		this.setDragDrop = this.setDragDrop.bind(this);
		this.setParent = this.setParent.bind(this);
		this.setChild = this.setChild.bind(this);
		this.init();
	}

	init() {
		this.dWrap = document.getElementById(this.options.wrapper);
		this.dParents = document.getElementsByClassName(this.options.parent);
		this.dChildren = document.getElementsByClassName(this.options.child);
		this.setDragDrop();
	}

	setDragDrop () {
		this.dWrap.ondrop = (ev) => {
			ev.preventDefault();
			let node = document.getElementsByClassName('drag')[0];
			this.dWrap.appendChild(node);
			node.className = 'parent';
		}

		this.dWrap.ondragover = (ev) => {
			ev.preventDefault();
		}


		forEach(this.dParents, (dom, index) => {
			this.setParent(dom);
		});

		forEach(this.dChildren, (dom, index) => {
			this.setChild(dom);
		})
	}

	setParent(dom) {
		dom.ondragstart = (ev) => {
			ev.target.className = 'parent drag';
		}

		dom.ondrop = (ev) => {
			ev.stopPropagation();
			ev.preventDefault();
			let node = document.getElementsByClassName('drag')[0];

			if (!node.children.length) {
				dom.appendChild(node);
				node.className = 'child';

				// 初始化拖拽事件
				this.setChild(node);
			}
		}

		dom.ondragover = (ev) => {
			ev.stopPropagation();
			ev.preventDefault();
		}
	}

	setChild(dom) {
		dom.ondragstart = (ev) => {
			ev.stopPropagation();
			ev.target.className = 'child drag';
		}
	}
}

// 遍历dom
function forEach (domList, fn) {
	for (let i = 0;i < domList.length;i++) {
		fn(domList[i], i);
	}
}

window.Drag = Drag;