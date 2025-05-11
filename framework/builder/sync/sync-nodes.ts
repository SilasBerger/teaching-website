import * as osPath from 'path';
import { canonicalNameFrom, markersFrom } from './markers';
import { Log } from '../../util/log';
import {
    SourceCandidacy,
    SourceCandidate,
    SourceCandidateGenerator,
    SourceCandidateType
} from '../types/sync';
import { Optional } from '../../../website/utils/optional';

export abstract class SyncNode {
    protected constructor(private _path: string) {}

    protected abstract get parent(): SyncNode;

    protected abstract get children(): Map<string, SyncNode>;

    abstract appendChild(path: string): SyncNode;

    get path() {
        return this._path;
    }

    get absPath(): string {
        if (!this.parent) {
            return this.path;
        }
        return osPath.join(this.parent.absPath, this.path);
    }

    get treePath(): string {
        if (!this.parent) {
            return '';
        }
        return osPath.join(this.parent.treePath, this.path);
    }

    getNode(childName: string): Optional<SyncNode> {
        if (this.children.has(childName)) {
            return Optional.of(this.children.get(childName));
        }
        return Optional.empty();
    }

    findNode(pathSegments: string[]): Optional<SyncNode> {
        const childName = pathSegments[0];
        const child = this.getNode(childName);

        if (child.isEmpty()) {
            return child;
        }

        if (pathSegments.length == 1) {
            return child;
        }
        return child.get().findNode(pathSegments.slice(1));
    }

    collect(predicate: (node: SyncNode) => any) {
        const myMatches: SyncNode[] = [];
        if (predicate(this)) {
            myMatches.push(this);
        }

        const childMatches = Array.from(this.children.keys()).flatMap((childPath) =>
            this.children.get(childPath).collect(predicate)
        );

        return myMatches.concat(childMatches);
    }

    isLeaf() {
        return this.children.size == 0;
    }
}

export class SourceNode extends SyncNode {
    private readonly _children = new Map<string, SourceNode>();
    private _isIgnored: boolean;
    private _sourceCandidacies: SourceCandidacy[] = [];

    constructor(
        path: string,
        private _markers: string[],
        private _parent?: SourceNode
    ) {
        super(path);
    }

    protected get parent(): SourceNode {
        return this._parent;
    }

    protected get children(): Map<string, SourceNode> {
        return this._children;
    }

    get markers(): string[] {
        return this._markers;
    }

    get isMarked() {
        return this._markers.length > 0;
    }

    get isIgnored(): boolean {
        return this._isIgnored;
    }

    get destTreePath(): string {
        if (!this.parent) {
            return '';
        }

        const explicitMapping = this._sourceCandidacies.find(
            (candidacy) => candidacy.type == SourceCandidateType.MAPPED && !candidacy.implicit
        );
        if (explicitMapping) {
            return explicitMapping.node.treePath;
        }

        return osPath.join(this.parent.destTreePath, this.path);
    }

    appendChild(path: string) {
        const childNode = new SourceNode(path, markersFrom(path), this);
        this._children.set(childNode.path, childNode);
        return childNode;
    }

    propagateAsSourceCandidateFor(destNode: DestNode, candidateGenerator: SourceCandidateGenerator) {
        this._addAsSourceCandidateFor(destNode, candidateGenerator);
        this._propagateAsSourceCandidateToRoot(destNode, candidateGenerator);
        this._propagateAsSourceCandidateToChildren(destNode, candidateGenerator);
    }

    private _addAsSourceCandidateFor(
        destNode: DestNode,
        candidateGenerator: SourceCandidateGenerator,
        implicit?: boolean
    ) {
        const candidate: SourceCandidate = {
            ...candidateGenerator(this),
            implicit: implicit ?? false
        };
        const candidacy: SourceCandidacy = {
            type: candidate.type,
            implicit: candidate.implicit,
            node: destNode
        };
        Log.instance.debug(
            `Adding /${candidate.node.treePath} as candidate for /${destNode.treePath}, type=${candidate.type}, implicit=${candidate.implicit}`
        );
        this._sourceCandidacies.push(candidacy);
        destNode.addSourceCandidate(candidate);
    }

    private _propagateAsSourceCandidateToRoot(
        destNode: DestNode,
        candidateGenerator: SourceCandidateGenerator
    ) {
        if (this.parent && destNode.parent) {
            this.parent._addAsSourceCandidateFor(destNode.parent, candidateGenerator, true);
            this._parent._propagateAsSourceCandidateToRoot(destNode.parent, candidateGenerator);
        }
    }

    private _propagateAsSourceCandidateToChildren(
        destNode: DestNode,
        candidateGenerator: SourceCandidateGenerator
    ) {
        Array.from(this._children.keys())
            .filter((childPath) => !this._children.get(childPath).isMarked)
            .forEach((childPath) => {
                const sourceChild = this._children.get(childPath);
                const destChild = destNode.ensureNode([canonicalNameFrom(childPath)]);
                sourceChild._addAsSourceCandidateFor(destChild, candidateGenerator, true);
                sourceChild._propagateAsSourceCandidateToChildren(destChild, candidateGenerator);
            });
    }

    propagateAsIgnored() {
        this._isIgnored = true;
        Log.instance.debug(`Marking /${this.treePath} as ignored`);
        this.children.forEach((child) => child.propagateAsIgnored());
    }
}

export class DestNode extends SyncNode {
    private readonly _children = new Map<string, DestNode>();
    private _sourceCandidates = new Map<string, SourceCandidate>();

    constructor(
        path: string,
        private _parent?: DestNode
    ) {
        super(path);
    }

    get parent(): DestNode {
        return this._parent;
    }

    protected get children(): Map<string, DestNode> {
        return this._children;
    }

    get sourceCandidates(): SourceCandidate[] {
        return Array.from(this._sourceCandidates.values());
    }

    appendChild(path: string) {
        const childNode = new DestNode(path, this);
        this._children.set(childNode.path, childNode);
        return childNode;
    }

    ensureNode(pathSegments: string[]): DestNode {
        const childName = pathSegments[0];
        const child = this.getNode(childName).orElse(() => {
            const newChild = new DestNode(childName, this);
            this._children.set(childName, newChild);
            return newChild;
        }) as DestNode;

        if (pathSegments.length == 1) {
            return child;
        }
        return child.ensureNode(pathSegments.slice(1));
    }

    addSourceCandidate(sourceCandidate: SourceCandidate) {
        const nodeId = sourceCandidate.node.path;
        if (!this._sourceCandidates.has(nodeId)) {
            this._sourceCandidates.set(nodeId, sourceCandidate);
        }
    }

    hasUsableSourceCandidates() {
        return this.sourceCandidates.filter((candidate) => !candidate.node.isIgnored).length > 0;
    }
}
