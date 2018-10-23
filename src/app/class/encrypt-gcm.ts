import { Injectable } from '@angular/core';

import { createCipheriv, createDecipheriv, randomBytes, CipherGCMTypes, pbkdf2Sync } from 'crypto';

@Injectable({
    providedIn: 'root'
})
export class EncryptGCM {

    private _algo: CipherGCMTypes = 'aes-128-gcm';
    private _nonce_size = 16;
    private _tag_size = 16;
    private _key_size = 16;
    private _PBKDF2_name = 'sha256';
    private _PBKDF2_salt_size = 16;
    private _PBKDF2_iterations = 32767;

    private _encrypt(pt: Buffer, k: Buffer): Buffer {
        const n = randomBytes(this._nonce_size);
        const c = createCipheriv(this._algo, k, n);
        const ct = Buffer.concat([c.update(pt), c.final()]);

        return Buffer.concat([n, ct, c.getAuthTag()]);
    }

    private _decrypt(pt: Buffer, k: Buffer): Buffer {
        const n = pt.slice(0, this._nonce_size);
        const ct = pt.slice(this._nonce_size, pt.length - this._tag_size);
        const tag = pt.slice(ct.length + this._nonce_size);

        const c = createDecipheriv(this._algo, k, n);
        c.setAuthTag(tag);
        return Buffer.concat([c.update(ct), c.final()]);
    }

    public encrypt(plainText: string, key: string): string {
        plainText = plainText || '';
        key = key || '';
        const s = randomBytes(this._PBKDF2_salt_size);
        const k = pbkdf2Sync(
            Buffer.from(key, 'utf8'),
            s,
            this._PBKDF2_iterations,
            this._key_size,
            this._PBKDF2_name
        );
        const eSalt = Buffer.concat([
            s,
            this._encrypt(Buffer.from(plainText, 'utf8'), k)
        ]);

        return eSalt.toString('base64');
    }

    public decrypt(payload: string, key: string): string {
        payload = payload || '';
        key = key || '';
        const pBuf = Buffer.from(payload, 'base64');
        const s = pBuf.slice(0, this._PBKDF2_salt_size);
        const cn = pBuf.slice(this._PBKDF2_salt_size);
        const k = pbkdf2Sync(
            Buffer.from(key, 'utf8'),
            s,
            this._PBKDF2_iterations,
            this._key_size, this._PBKDF2_name
        );

        return this._decrypt(cn, k).toString('utf8');
    }

}
