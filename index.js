function $(className) {
	if (typeof className === 'string') {
		return Array.from(document.getElementsByClassName(className));
	} else {
		return Array.from(className);
	}
}

// 工具箱
let utils = {
	hasClass(dom, className) {
		return dom && dom.className.indexOf(className) >= 0;
	},

	addClass(dom, className) {
		dom.className += ' ' + className;
	},

	removeClass(dom, className) {
		let reg = new RegExp(`\\s${className}|${className}`, 'g');
		dom.className = dom.className.replace(reg, '');
	},

	toggle(dom, className) {
		if (dom.className.match(className)) {
			this.removeClass(dom, className);
		} else {
			this.addClass(dom, className);
		}
	},

	appendByIndex(parents, node, index) {
		if (parents.children.length === index + 1) {
			parents.appendChild(node);
		} else if (node.isSameNode(parents.children[index - 1])) {
			parents.insertBefore(node, parents.children[index + 1]);
		} else {
			parents.insertBefore(node, parents.children[index]);
		}
	}
}

class Drag {
	constructor (options) {
		this.options = options || {};
		this.overNode = null; //当前经过的节点
		this.curNode = null; //当前被选中的节点
		this.contain = null; //容器节点

		this.init = this.init.bind(this);
		this.setDragDrop = this.setDragDrop.bind(this);
		this.setParent = this.setParent.bind(this);
		this.setChild = this.setChild.bind(this);
		this.init();
	}

	init() {
		this.dWrap = document.getElementById(this.options.wrapper);
		this.dParents = Array.from(document.getElementsByClassName(this.options.parent));
		this.dChildren = Array.from(document.getElementsByClassName(this.options.child));
		this.setDragDrop();
	}

	setDragDrop () {
		this.dWrap.ondrop = ev => {
			ev.preventDefault();
			ev.stopPropagation();
			let node = document.getElementsByClassName('drag')[0];

			// 判断落点
			if (this.overNode && !node.isSameNode(this.curNode)) {
				this.dWrap.insertBefore(node, this.curNode);
			}
			node.style.backgroundColor = '';
			node.className = 'parent';
			this.setParent(node);
		};

		this.dWrap.ondragover = ev => {
			ev.preventDefault();
		};

		this.dWrap.ondragenter = ev => {

		}

		this.dParents.forEach(dom => {
			dom.draggable = true;
			this.setParent(dom);
		});

		this.dChildren.forEach(dom => {
			dom.draggable = true;
			this.setChild(dom);
		});
	}

	setParent(dom) {
		dom.ondragstart = ev => {
			ev.target.style.backgroundColor = '#89c5f1';
			utils.addClass(ev.target, 'drag');
		};

		dom.ondrop = ev => {
			ev.stopPropagation();
			ev.preventDefault();

			/*let node = document.getElementsByClassName('drag')[0];
			let hasChild = node.children.length; // 判断是否还有子节点

			if (!hasChild && this.curNode) {
				node.remove();
				dom.insertBefore(node, null);
				node.className = 'child';

				// 初始化拖拽事件
				this.setChild(node);
			} else {
				utils.removeClass(node, 'drag');
			}
			node.style.backgroundColor = '';*/
		};

		dom.ondragover = ev => {
			ev.preventDefault();
			ev.stopPropagation();
		};

		dom.ondragend = ev => {
			console.log('parent');
		};

		dom.ondragenter = ev => {
			ev.preventDefault();
			ev.stopPropagation();
			/*if (!ev.target.isSameNode(dom) && this.overNode && !utils.hasClass(this.overNode, 'child')) {
				this.curNode = ev.target;
			}
			this.overNode = ev.target;*/
		};
	}

	setChild(dom) {
		dom.ondragstart = ev => {
			ev.stopPropagation();
			ev.target.style.backgroundColor = '#89c5f1';
			utils.addClass(ev.target, 'drag');
			this.curNode = ev.target;
		};

		dom.ondragenter = ev => {
			ev.stopPropagation();
			let target = ev.target;

			if (this.curNode.children.length || target.isSameNode(this.curNode)) {
				return false;
			}

			let parentNode = target.parentNode;
			let index = $(parentNode.children).indexOf(target);

			utils.appendByIndex(parentNode, this.curNode, index);
			utils.removeClass(this.curNode, 'drag');
		};

		dom.ondragend = ev => {
			ev.preventDefault();
			ev.stopPropagation();
			this.curNode.style.backgroundColor = '';
		}

		dom.ondrop = undefined;
		dom.ondragover = undefined;
	}
}

window.Drag = Drag;