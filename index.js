const Listview = require('./Whead-Listview');
const logger = require('./logger.js');


let timeout_limit = 10000; // in millisec

let thread_array = [];

let fecth_array = [2040];

/*for (let index = 0; index < 35000; index++) {
  
  fecth_array.push(117207+index);

}*/



function async_fecth(fecth_array,thread = 10,step = 0) {

      if(step > fecth_array.length)
          return;

      setTimeout(() => {
         
        for(let i=0; i < thread;i++)
        {

          if(thread_array[i] === undefined) // Fill the threads at startup
          {
            thread_array[i] = new Listview(fecth_array[step]);
            step++;
          }
          else
          {
            if(thread_array[i].state == 1) // Re-init executed threads
            {
              thread_array[i] = new Listview(fecth_array[step]);
              step++;
            }
           
            if(thread_array[i].time_created + timeout_limit < Date.now())  // Cleanup timeout
            {
              thread_array[i] = new Listview(fecth_array[step]);
              step++;
            }
          }
        }

  
        async_fecth(fecth_array,thread,step);

        logger.info('Update tick'+'step = '+fecth_array[step]);

      }, 4000);
      
  }
  

  async_fecth(fecth_array); // Y Thread count

