# Kanpo

Another proxy between your local development server and the _outside_ world - this time though, via WebRTC.

## Why

Because you don't need a third party server to relay your data and most certainly you do not need to pay them to remove throttling and because no one will be able to eve's drop into your traffic.

## Usage

First part will setup the WebRTC connection. Once that is done, the guest machine will execute a local server, all requests going to that server will be proxied to the remote machine.

### Step 1

Host (machine wanting to share local port 3000):

`npx kanpo -p 3000 # <- will render webrtc offer and will wait for answer`

### Step 2

Guest (maching wanting to access some other machine's local port)

`npx kanpo -t guest # <- will ask for offer from step 1 and will render answer`

### Step 3

In Host machine (from step 1), input answer from step 2

### Step 4

Open up `http://localhost:300` in Guest machine to see content from Host machine's server.


## Params

**`--port, -p`**

- Default: `80` for `host` and `3000` for `guest`

Sets port Kanpo will tunel

**`--type, -t`**

- Values: `host` or `guest`
- Default: host

Sets type of executing script. Host will share local server and guest will receive create a local port where the proxied data will be sent.
