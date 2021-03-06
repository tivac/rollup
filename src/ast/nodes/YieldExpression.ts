import MagicString from 'magic-string';
import { RenderOptions } from '../../utils/renderHelpers';
import { ExecutionPathOptions } from '../ExecutionPathOptions';
import { UNKNOWN_PATH } from '../values';
import * as NodeType from './NodeType';
import { ExpressionNode, NodeBase } from './shared/Node';

export default class YieldExpression extends NodeBase {
	argument!: ExpressionNode | null;
	delegate!: boolean;
	type!: NodeType.tYieldExpression;

	bind() {
		super.bind();
		if (this.argument !== null) {
			this.argument.deoptimizePath(UNKNOWN_PATH);
		}
	}

	hasEffects(options: ExecutionPathOptions) {
		return (
			!options.ignoreReturnAwaitYield() ||
			(this.argument !== null && this.argument.hasEffects(options))
		);
	}

	render(code: MagicString, options: RenderOptions) {
		if (this.argument) {
			this.argument.render(code, options);
			if (this.argument.start === this.start + 5 /* 'yield'.length */) {
				code.prependLeft(this.start + 5, ' ');
			}
		}
	}
}
