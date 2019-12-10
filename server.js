'use strict';

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const dynamodb = require('./dynamoDB.js');
console.log(dynamodb);

const dummy_data = [
    {
        "message": {
            "S": "Hello World 2!"
        },
        "user_id": {
            "S": "c3e31655-92f0-4d0a-ac13-070674aa2155"
        },
        "message_id": {
            "S": "MS_2019090514601_01a1aa30-4abc-43d3-9781-59c03373f5be"
        },
        "sort": {
            "S": "WS_c54b7830-89ea-4dd2-8bca-b6bef8b1adc2#CH_76f57ec8-f2c7-4406-8ef5-dcc3ef1eba62#MS_2019090514601_01a1aa30-4abc-43d3-9781-59c03373f5be"
        }
    },
    {
        "write": {
            "BOOL": true
        },
        "user_id": {
            "S": "5bdbbe89-6f22-4293-b4ab-5a07c8e5a589"
        },
        "sort": {
            "S": "WS_c54b7830-89ea-4dd2-8bca-b6bef8b1adc2#CF_CH_76f57ec8-f2c7-4406-8ef5-dcc3ef1eba62"
        },
        "read": {
            "BOOL": true
        },
        "channel_id": {
            "S": "76f57ec8-f2c7-4406-8ef5-dcc3ef1eba62"
        }
    },
    {
        "channel_name": {
            "S": "Channel 1"
        },
        "message_id": {
            "S": "20190905163200_528f97f-a984-4179-837b-78fbe71f9eb6"
        },
        "message": {
            "S": "Hello World!"
        },
        "user_id": {
            "S": "5bdbbe89-6f22-4293-b4ab-5a07c8e5a589"
        },
        "sort": {
            "S": "WS_c54b7830-89ea-4dd2-8bca-b6bef8b1adc2#CH_76f57ec8-f2c7-4406-8ef5-dcc3ef1eba62#MS_20190905163200_528f97f-a984-4179-837b-78fbe71f9eb6"
        },
        "channel_id": {
            "S": "76f57ec8-f2c7-4406-8ef5-dcc3ef1eba62"
        }
    },
    {
        "password": {
            "S": "password"
        },
        "user_id": {
            "S": "e91473f3-fe2d-4af3-9708-2c249b4f5d67"
        },
        "sort": {
            "S": "CF_WS_c33b17bc-7450-47b7-8f5c-4334fe5b6331"
        },
        "role": {
            "S": "admin"
        },
        "email": {
            "S": "test@example.com"
        }
    },
    {
        "workspace_name": {
            "S": "Work Space 1"
        },
        "user_id": {
            "S": "e91473f3-fe2d-4af3-9708-2c249b4f5d67"
        },
        "sort": {
            "S": "WS_c33b17bc-7450-47b7-8f5c-4334fe5b6331"
        },
        "workspace_id": {
            "S": "c33b17bc-7450-47b7-8f5c-4334fe5b6331"
        }
    }
]

http.listen(PORT, () => console.log(`listening on *:${PORT}`));

app.get('/', (req, res) => {
    // res.writeHead(200, { 'Content-Type': 'text/css' });
    res.sendFile(__dirname + '/index.html')
});

app.get('/getAll', (req, res) => {
    const params = {
        TableName: 'demo2',
        Select: "ALL_ATTRIBUTES"
    };
    dynamodb.scan(params, (err, data) => {
        if (err) {
            console.log(err, err.stack);
        } else {
            var output = [];
            var messages = [];
            data["Items"].forEach((value, index, array) => {
                if (value["message"] !== undefined) {
                    console.log(value);
                    output.push(value);
                    messages.push(value["message"]);
                }
            });
            // console.log(data);
            // console.log(JSON.stringify(data, null, 2));
            res.send(messages);
        }
    });
});

app.post('/sendMessage', (req, res) => {
    var params = {
        TableName: 'demo2',
        Item: {
            'message': message,
            'sort': sort,
            'user_id': user_id, // 無くて良い？
        }
    };
    console.log(req.body);
    res.send('POST is sended.');
    dynamodb.putItem(params, (err, data) => {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log(data);
        }
    });
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        console.log(typeof(msg));
        console.log(msg);
        io.emit('chat message', msg);
        console.log(`message: ${msg}`);
    });
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('transfer data', (data) => {
        io.emit('chat message', data);
        if (data instanceof Object) {
            var message = data;
            var message_json = JSON.stringify(data);
            console.log(`message: ${message['Message']['S']}`);
            console.log(`message: ${message_json}`);
        }
    });
});
