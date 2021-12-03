describe('<BlastInputSequences />', () => {

  // describe('handling of input sequences', () => {

  //   it('correctly accepts a bare sequence', () => {

  //   });
  
  //   it('correctly accepts a FASTA input containing a single sequence', () => {
  
  //   });
  
  //   it('correctly accepts a FASTA input containing multiple sequences', () => {

  //   });

  //   it('correctly accepts a sequence starting with numbered lines', () => {

  //   });

  //   it('transforms lower-case letters in sequences to upper-case', () => {

  //   })

  // });


  describe('initial state', () => {
    
    it('shows a single empty input', () => {

    });

  });

  describe('header', () => {

    it('shows sequence counter, starting with 0', () => {

    });

    it('has a control to clear all sequences', () => {

    });

  });

  describe('with added sequences', () => {

    it('shows multiple inputs, each containing a sequence', () => {

    });

    it('shows a button for adding another sequence and tries to classify sequence', () => {

    });

    /**
     * QUESTIONS
     * 
     * WHAT SHOULD HAPPEN IF USER ADDS INADMISSIBLE SEQUECE?
     * - a sequence different from the predicted (and do we need this prediction at all?)
     * - a sequence with inadmissible characters?
     * - too short a sequence?
     * 
     * WHAT SHOULD HAPPEN IF USER ADDS MORE SEQUENCES THAN WE ARE LIMITING THEM TO?
     * 
     * WHAT HAPPENS TO THE FILE INPUT ELEMENT WHEN THE USER STARTS TYPING?
    */
    

  });

});
