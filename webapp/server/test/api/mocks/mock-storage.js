// https://gist.github.com/nfarina/90ba99a5187113900c86289e67586aaa
// Quick & Dirty Google Cloud Storage emulator for tests. Requires
// `stream-buffers` from npm. Use it like this:
//
// `new MockStorage().bucket('my-bucket').file('my_file').createWriteStream()`
//

class MockStorage {
  buckets: {[name: string]: MockBucket};

  constructor() {
    this.buckets = {};
  }

  bucket(name: string) {
    return this.buckets[name] ||
      (this.buckets[name] = new MockBucket(name));
  }
}

class MockBucket {
  name: string;
  files: {[path: string]: MockFile};

  constructor(name: string) {
    this.name = name;
    this.files = {};
  }

  file(path: string) {
    return this.files[path] ||
      (this.files[path] = new MockFile(path));
  }
}

class MockFile {
  path: string;
  contents: Buffer;
  metadata: Object;

  constructor(path: string) {
    this.path = path;
    this.contents = new Buffer(0);
    this.metadata = {};
  }

  get() {
    return [this, this.metadata];
  }

  setMetadata(metadata: Object) {
    const customMetadata = {...this.metadata.metadata, ...metadata.metadata};
    this.metadata = {...this.metadata, ...metadata, metadata: customMetadata};
  }

  createReadStream() {
    const streamBuffers = require('stream-buffers');
    const readable = new streamBuffers.ReadableStreamBuffer();
    readable.put(this.contents);
    readable.stop();
    return readable;
  }

  createWriteStream({metadata}: Object) {
    this.setMetadata(metadata);
    const streamBuffers = require('stream-buffers');
    const writable = new streamBuffers.WritableStreamBuffer();
    writable.on('finish', () => {
      this.contents = writable.getContents();
    });
    return writable;
  }

  delete() {
    return Promise.resolve();
  }
}