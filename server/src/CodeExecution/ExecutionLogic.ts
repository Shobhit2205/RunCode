import Docker, { Container } from 'dockerode';
import { DefaultEventsMap, Server, Socket } from 'socket.io';
import ACTIONS from '../utils/actions';
const docker = new Docker(); 

const imageName = 'shobhit2205/multi-lang-compiler:v1.0'; 
const containerName = 'remote-code-container';

async function getContainerByName(name: string) {
    try {
      const containers = await docker.listContainers({ all: true });
      return containers.find(container => container.Names.includes(`/${name}`));
    } catch (err) {
      console.error('Error fetching containers:', err);
      return null;
    }
}

async function pullImage(imageName: string) {
  try {
    console.log(`Fetching image ${imageName}...`);
    await docker.pull(imageName);
    console.log('Image pulled successfully!');
  } catch (err) {
    console.error('Error fetching image:', err);
  }
}

async function getorCreateContainer() {
  const imageExists = await docker.listImages().then(images =>
    images.some(image => image.RepoTags?.includes(imageName))
  );

  if (!imageExists) {
    await pullImage(imageName);
  }

  let containerData = await getContainerByName(containerName);

  if (containerData) {
    let container = docker.getContainer(containerData.Id);
    if (containerData.State !== 'running') {
      await container.start();
    }
    // console.log('Container already exists and is running');
    return container;
  } else {
    let newContainer = await docker.createContainer({
      Image: imageName,
      name: containerName,
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
      Cmd: ['/bin/bash'],
      OpenStdin: true,
      StdinOnce: false
    });
    console.log('New container created and started');
    await newContainer.start();
    return newContainer;
  }
}


async function execCommand(container: Container, io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, socket: Socket, language: string, code: string, roomId: string) {
    let compileCommand = '';
    let runCommand = '';
  
    // Determine compile and run commands based on language
    switch (language) {
      case 'cpp':
        compileCommand = `echo '${code.replace(/'/g, "'\\''")}' > main.cpp && g++ main.cpp -o main`;
        runCommand = `./main`;
        break;
      case 'python':
        compileCommand = `echo '${code.replace(/'/g, "'\\''")}' > main.py`;
        runCommand = `python3 main.py`;
        break;
      case 'javascript':
        compileCommand = `echo '${code.replace(/'/g, "'\\''")}' > main.js`;
        runCommand = `node main.js`;
        break;
      case 'java':
        const classNameMatch = code.match(/public\s+class\s+(\w+)/);
        const className = classNameMatch ? classNameMatch[1] : 'Main';
        compileCommand = `echo '${code.replace(/'/g, "'\\''")}' > ${className}.java && javac ${className}.java`;
        runCommand = `java ${className}`;
        break;
      case 'go':
        compileCommand = `echo '${code.replace(/'/g, "'\\''")}' > main.go`;
        runCommand = `go run main.go`;
        break;
      case 'rust':
        compileCommand = `echo '${code.replace(/'/g, "'\\''")}' > main.rs && rustc main.rs`;
        runCommand = `./main`;
        break;
      case 'c':
        compileCommand = `echo '${code.replace(/'/g, "'\\''")}' > main.c && gcc main.c -o main`;
        runCommand = `./main`;
        break;
      case 'php':
        compileCommand = `echo '${code.replace(/'/g, "'\\''")}' > main.php`;
        runCommand = `php main.php`;
        break;
      default:
        throw new Error('Unsupported language');
    }
  
    // Create the exec instance
    const exec = await container.exec({
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
      Cmd: ['bash', '-c', `
        mkdir -p coding &&
        cd coding && 
        mkdir -p room-${roomId} &&
        cd room-${roomId} &&
        mkdir -p ${language} &&
        cd ${language} &&
        ${compileCommand} && 
        ${runCommand}
      `]
    });
  
    // Start the exec process
    exec.start({ hijack: true }, (err, stream) => {
      if (err) {
        console.error('Error executing command:', err);
        return;
      }
  

      socket?.on(ACTIONS.INPUT, ({data}) => {
        // console.log('input: ', data);
        stream?.write(data + '\n');
      });
  
      // Log the output
      stream?.on('data', (data) => {
        const output = data.toString();
        // console.log(output.toString());
        socket.emit(ACTIONS.OUTPUT, { data: output });
      });
  
      // Handle errors
      stream?.on('error', (error) => {
        console.error('Error in stream:', error);
      });
  
      stream?.on('end', () => {
        // console.log('\nExecution completed.');
        socket.emit(ACTIONS.EXECUTION_COMPLETE);
      });
    });
}

export default async function run(io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>, socket: Socket, language: string, code: string, roomId: string) {
    try {
        // console.log(typeof code);
        let cont = await getorCreateContainer();
        await execCommand(cont, io, socket, language, code, roomId);
    } catch (error) {
        console.log('Error in running code', error);
    }
}