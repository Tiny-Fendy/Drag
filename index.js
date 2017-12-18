function $(selector) {
	if (typeof selector === 'string') {
		return Array.from(document.querySelectorAll(selector));
	} else {
		return Array.from(selector);
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
		this.activeNode = [null, null]; //当前的展开节点

		this.init = this.init.bind(this);
		this.setDragDrop = this.setDragDrop.bind(this);
		this.setParent = this.setParent.bind(this);
		this.setChild = this.setChild.bind(this);
		this.toggleParents = this.toggleParents.bind(this);
		this.toggleChild = this.toggleChild.bind(this);
		this.closeNode = this.closeNode.bind(this);
		this.openNode = this.openNode.bind(this);
		this.init();
	}

	init() {
		this.$wrap = $('#' + this.options.wrapper)[0];
		this.$parents = $('.' + this.options.parent);
		this.$children = $('.' + this.options.child);
		this.setDragDrop();
	}

	setDragDrop () {
		this.$wrap.ondragover = ev => {
			ev.preventDefault();
		};

		this.$wrap.ondragenter = ev => {
			ev.preventDefault();

			let index = $(this.$wrap.children).indexOf(this.overNode);
			utils.appendByIndex(this.$wrap, this.curNode, index);
		}

		this.$parents.forEach(dom => {
			dom.draggable = true;
			this.setParent(dom);
		});

		this.$children.forEach(dom => {
			dom.draggable = true;
			this.setChild(dom);
		});
	}

	setParent(dom) {
		dom.className = this.options.parent;

		// 绑定展开折叠按钮
		$(dom.children).forEach(icon => {
			if (icon.nodeName === 'I') {
				icon.onclick = () => {
					this.toggleParents(dom);
				}
			}
		});

		dom.ondragstart = ev => {
			ev.stopPropagation();
			ev.target.style.backgroundColor = '#89c5f1';
			utils.addClass(ev.target, 'drag');
			this.curNode = ev.target;
		};

		dom.ondragenter = ev => {
			ev.preventDefault();
			ev.stopPropagation();

			this.overNode = ev.target;

			/*let target = ev.target;
			if (target.isSameNode(this.curNode)) {
				return;
			}
			if (this.curNode.getElementsByClassName('child').length) {
				utils.appendByIndex(this.$wrap, this.curNode, $('.parent').indexOf(target));
			} else if (!target.getElementsByClassName('child').length) {
				dom.querySelector('.children').appendChild(this.curNode);
			}*/
		};

		dom.ondragover = ev => {
			ev.preventDefault();
		};

		dom.ondragend = ev => {
			ev.preventDefault();
			ev.stopPropagation();

			this.curNode.style.backgroundColor = '';
			utils.removeClass(this.curNode, 'drag');
			if (utils.hasClass(this.curNode.parentNode.parentNode, 'parent')) {
				this.setChild(this.curNode);
			}
		}
	}

	setChild(dom) {
		dom.className = this.options.child;

		// 绑定展开折叠按钮
		dom.querySelector('i').onclick = () => {
			this.toggleChild(dom);
		};

		dom.ondragstart = ev => {
			ev.stopPropagation();
			ev.target.style.backgroundColor = '#89c5f1';
			utils.addClass(ev.target, 'drag');
			this.curNode = ev.target;
		};

		dom.ondragenter = ev => {
			ev.preventDefault();
			ev.stopPropagation();

			if (this.curNode.getElementsByClassName('child').length || dom.isSameNode(this.curNode)) {
				return false;
			}
			let parentNode = dom.parentNode;
			let index = $(parentNode.getElementsByClassName('child')).indexOf(dom);
			utils.appendByIndex(parentNode, this.curNode, index);
		};

		dom.ondragend = ev => {
			ev.preventDefault();
			ev.stopPropagation();

			this.curNode.style.backgroundColor = '';
			utils.removeClass(this.curNode, 'drag');
			if (!utils.hasClass(this.curNode.parentNode.parentNode, 'parent')) {
				this.setParent(this.curNode);
			}
		}

		dom.ondragover = undefined;
	}

	toggleParents(curDom) {
		let parent = this.activeNode[0];
		let child = this.activeNode[1];
		let length = curDom.querySelectorAll('.child').length;

		if (parent) {
			this.closeNode(parent, 0);
			if (!curDom.isSameNode(parent)) {
				this.openNode(curDom, 0, length * 35);
				if (child) this.closeNode(child, 1);
			}
		} else {
			this.openNode(curDom, 0, length * 35);
		}
	}

	toggleChild(curDom) {
		let parent = this.activeNode[0].querySelector('.children');
		let child = this.activeNode[1];

		if (child) {
			this.closeNode(child, 1);

			// 自身折叠则清理activeNode，同时还原容器高度
			if (curDom.isSameNode(child)) {
				parent.style.height = `${parent.clientHeight - 40}px`;
			} else {
				this.openNode(curDom, 1, 40);
			}
		} else {
			parent.style.height = `${parent.clientHeight + 40}px`;
			this.openNode(curDom, 1, 40);
		}
	}

	// 关闭节点
	closeNode(dom, type) {
		let wrap = dom.querySelector('.children');

		dom.querySelector('i').className = 'fa fa-plus';
		wrap.style.height = 0;
		this.activeNode[type] = null;
	}

	openNode(dom, type,height) {
		let wrap = dom.querySelector('.children');

		wrap.style.height = height + 'px';
		dom.querySelector('i').className = 'fa fa-minus';
		this.activeNode[type] = dom;
	}
}

window.Drag = Drag;