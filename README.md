# stat-again
Helper for running tests interacting with the file system: It should happen, but when? So stat again!

## Simple usage

When a file or a directory should be there but is not, or shouldn't be there but still is, promises are to be made and resolved. Node module ```stat-again``` factors out some of the cumbersome logic.

### Expecting a file or directory to be created

```js
import {expectEventuallyFound} from 'stat-again';

const pathname = 'dir/file.js';
const delayInMs = 30;
const numberOfTries = 10;

expectEventuallyFound(pathname, delayInMs, numberOfTries)
  .then(found => {
    if (found) {
      // Do stuff with pathname file
    } else {
      // Acknowledge pathname file was not found within a reasonable time
    }
  }, err => {
    // Handle unexpected error
  });
```

### Expecting a file or directory to be deleted

```js
import {expectEventuallyDeleted} from 'stat-again';

const pathname = 'dir/file.js';
const delayInMs = 30;
const numberOfTries = 10;

expectEventuallyDeleted(pathname, delayInMs, numberOfTries)
  .then(deleted => {
    if (deleted) {
      // Rejoice pathname file was deleted as expected and proceed
    } else {
      // Acknowledge failure to delete pathname file within a reasonable time
    }
  }, err => {
    // Handle unexpected error
  });
```

### Stating eventually a file or directory

Stats are as returned by [fs.stat(path, callback)](https://nodejs.org/api/fs.html#fs_fs_stat_path_callback).

```js
import statAgain from 'stat-again';

const pathname = 'dir/file.js';
const delayInMs = 30;
const numberOfTries = 10;

statAgain(pathname, delayInMs, numberOfTries)
  .then(stats => {
    // Do something with stats
  }, err => {
    // Handle unexpected error
  });
```

## License

stat-again is [MIT licensed](./LICENSE).

© 2016 [Jason Lenoble](mailto:jason.lenoble@gmail.com)
