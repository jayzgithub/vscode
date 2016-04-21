/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { TPromise } from 'vs/base/common/winjs.base';
import { IChannel } from 'vs/base/parts/ipc/common/ipc';
import { IRawGitService, RawServiceState, IRawStatus, IPushOptions } from './git';

export interface IGitChannel extends IChannel {
	call(command: 'getVersion'): TPromise<string>;
	call(command: 'serviceState'): TPromise<RawServiceState>;
	call(command: 'status'): TPromise<IRawStatus>;
	call(command: 'init'): TPromise<IRawStatus>;
	call(command: 'add', filesPaths?: string[]): TPromise<IRawStatus>;
	call(command: 'stage', filePath: string, content: string): TPromise<IRawStatus>;
	call(command: 'branch', name: string, checkout?: boolean): TPromise<IRawStatus>;
	call(command: 'checkout', treeish?: string, filePaths?: string[]): TPromise<IRawStatus>;
	call(command: 'clean', filePaths: string[]): TPromise<IRawStatus>;
	call(command: 'undo'): TPromise<IRawStatus>;
	call(command: 'reset', treeish:string, hard?: boolean): TPromise<IRawStatus>;
	call(command: 'revertFiles', treeish:string, filePaths?: string[]): TPromise<IRawStatus>;
	call(command: 'fetch'): TPromise<IRawStatus>;
	call(command: 'pull', rebase?: boolean): TPromise<IRawStatus>;
	call(command: 'push', remote?: string, name?: string, options?: IPushOptions): TPromise<IRawStatus>;
	call(command: 'sync'): TPromise<IRawStatus>;
	call(command: 'commit', message:string, amend?: boolean, stage?: boolean): TPromise<IRawStatus>;
	call(command: 'detectMimetypes', path: string, treeish?: string): TPromise<string[]>;
	call(command: 'show', path: string, treeish?: string): TPromise<string>;
	call(command: 'onOutput'): TPromise<void>;
	call(command: string, ...args: any[]): TPromise<any>;
}

export class GitChannel implements IGitChannel {

	constructor(private service: TPromise<IRawGitService>) { }

	call(command: string, ...args: any[]): TPromise<any> {
		switch (command) {
			case 'getVersion': return this.service.then(s => s.getVersion());
			case 'serviceState': return this.service.then(s => s.serviceState());
			case 'status': return this.service.then(s => s.status());
			case 'status': return this.service.then(s => s.status());
			case 'init': return this.service.then(s => s.init());
			case 'add': return this.service.then(s => s.add(args[0]));
			case 'stage': return this.service.then(s => s.stage(args[0], args[1]));
			case 'branch': return this.service.then(s => s.branch(args[0], args[1]));
			case 'checkout': return this.service.then(s => s.checkout(args[0], args[1]));
			case 'clean': return this.service.then(s => s.clean(args[0]));
			case 'undo': return this.service.then(s => s.undo());
			case 'reset': return this.service.then(s => s.reset(args[0], args[1]));
			case 'revertFiles': return this.service.then(s => s.revertFiles(args[0], args[1]));
			case 'fetch': return this.service.then(s => s.fetch());
			case 'pull': return this.service.then(s => s.pull(args[0]));
			case 'push': return this.service.then(s => s.push(args[0], args[1], args[2]));
			case 'sync': return this.service.then(s => s.sync());
			case 'commit': return this.service.then(s => s.commit(args[0], args[1], args[2]));
			case 'detectMimetypes': return this.service.then(s => s.detectMimetypes(args[0], args[1]));
			case 'show': return this.service.then(s => s.show(args[0], args[1]));
			case 'onOutput': return this.service.then(s => s.onOutput());
		}
	}
}

export class UnavailableGitChannel implements IGitChannel {

	call(command: string): TPromise<any> {
		switch (command) {
			case 'serviceState': return TPromise.as(RawServiceState.GitNotFound);
			default: return TPromise.as(null);
		}
	}
}

export class GitChannelClient implements IRawGitService {

	constructor(private channel: IGitChannel) { }

	getVersion(): TPromise<string> {
		return this.channel.call('getVersion');
	}

	serviceState(): TPromise<RawServiceState> {
		return this.channel.call('serviceState');
	}

	status(): TPromise<IRawStatus> {
		return this.channel.call('status');
	}

	init(): TPromise<IRawStatus> {
		return this.channel.call('init');
	}

	add(filesPaths?: string[]): TPromise<IRawStatus> {
		return this.channel.call('add', filesPaths);
	}

	stage(filePath: string, content: string): TPromise<IRawStatus> {
		return this.channel.call('stage', filePath, content);
	}

	branch(name: string, checkout?: boolean): TPromise<IRawStatus> {
		return this.channel.call('branch', name, checkout);
	}

	checkout(treeish?: string, filePaths?: string[]): TPromise<IRawStatus> {
		return this.channel.call('checkout', treeish, filePaths);
	}

	clean(filePaths: string[]): TPromise<IRawStatus> {
		return this.channel.call('clean', filePaths);
	}

	undo(): TPromise<IRawStatus> {
		return this.channel.call('undo');
	}

	reset(treeish:string, hard?: boolean): TPromise<IRawStatus> {
		return this.channel.call('reset', treeish, hard);
	}

	revertFiles(treeish:string, filePaths?: string[]): TPromise<IRawStatus> {
		return this.channel.call('revertFiles', treeish, filePaths);
	}

	fetch(): TPromise<IRawStatus> {
		return this.channel.call('fetch');
	}

	pull(rebase?: boolean): TPromise<IRawStatus> {
		return this.channel.call('pull', rebase);
	}

	push(remote?: string, name?: string, options?:IPushOptions): TPromise<IRawStatus> {
		return this.channel.call('push', remote, name, options);
	}

	sync(): TPromise<IRawStatus> {
		return this.channel.call('sync');
	}

	commit(message:string, amend?: boolean, stage?: boolean): TPromise<IRawStatus> {
		return this.channel.call('commit', message, amend, stage);
	}

	detectMimetypes(path: string, treeish?: string): TPromise<string[]> {
		return this.channel.call('detectMimetypes', path, treeish);
	}

	show(path: string, treeish?: string): TPromise<string> {
		return this.channel.call('show', path, treeish);
	}

	onOutput(): TPromise<void> {
		return this.channel.call('onOutput');
	}
}