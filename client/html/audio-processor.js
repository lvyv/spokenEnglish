class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.audioDataQueue = [];
        this.port.onmessage = (event) => {
            console.log('Message received in AudioWorkletProcessor:', event.data);
            const audioData = event.data;
            const float32Array = new Float32Array(audioData);
            this.audioDataQueue.push(float32Array);
            // if (event.data && event.data.type === 'audio') {
                // const float32Array = new Float32Array(event.data.audioBuffer);
                // this.audioDataQueue.push(float32Array);
            // }
        };
    }

    process(inputs, outputs, parameters) {
        const output = outputs[0];
        if (this.audioDataQueue.length > 0) {
            const channelData = this.audioDataQueue.shift();
            for (let channel = 0; channel < output.length; channel++) {
                const outputChannel = output[channel];
                outputChannel.set(channelData.subarray(0, outputChannel.length));
            }
            // for (let channel = 0; channel < output.length; channel++) {
            //     const outputChannel = output[channel];
            //     for (let i = 0; i < outputChannel.length; i++) {
            //         // outputChannel[i] = channelData[i] || 0;  // 填充数据或默认为0
            //         outputChannel[i] = channelData[i % channelData.length] || 0;
            //     }
            // }

        }
        return true;
    }
}

registerProcessor('audio-processor', AudioProcessor);
//// random-noise-processor.js
//class RandomNoiseProcessor extends AudioWorkletProcessor {
//    process(inputs, outputs, parameters) {
//      const output = outputs[0];
//      output.forEach((channel) => {
//        for (let i = 0; i < channel.length; i++) {
//          channel[i] = Math.random() * 2 - 1;
//        }
//      });
//      return true;
//    }
//  }
//
//  registerProcessor("random-noise-processor", RandomNoiseProcessor);