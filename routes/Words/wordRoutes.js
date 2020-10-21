const router = require('express').Router();
const Word = require('./models/Word');


router.get('/get-words', (req, res) => {
    Word.find()
        .then((foundWords) => {
            return res.render('main/index', { wordsList: foundWords });
            // return res.json({ foundWords }); - This works for postman
        })
        .catch((err) => res.json({ err }));
});

router.post('/add-word', (req, res) => {
    Word.findOne({ word: req.body.word })
    .then((foundWord) => {
        if(foundWord) {
            return res.send('Word Already Exists');
        } else {
            if(!req.body.word || !req.body.meaning) {
                return res.send('All Inputs Must Be Filled');
            }

            let newWord = new Word({
                word: req.body.word,
                meaning: req.body.meaning
            });

            newWord.save()
            .then((wordCreated) => {
                return res.redirect('/words/get-words');
                // return res.status(200).json({ wordCreated });
            }) 
            .catch((err) => { 
                res.status(500).json({ message: 'Word Not Created', err });
            });
        }
    })
});

router.get('/add-word', (req, res) => {
    return res.render('main/add-word');
});

router.get('/single-word/:wordId', (req, res) => {
    Word.findById(req.params.wordId)
    .then((foundWord) => {
        if(foundWord) {
            return res.render('main/single-word', { foundWord: foundWord });
        } else {
            return res.status(400).send('No Word Found.');
        }
    })
    .catch((err) => {
        return res.status(500)
        .json({ confirmation: 'fail', message: 'Server Error', err });
    })
});

router.put('/update-word/:wordId', (req, res) => {
    Word.findById(req.params.wordId)
    .then((foundWord) => {
        if(!foundWord) {
            return res.status(400).send('No Word Found.');
        }

        if(!req.body.meaning) {
            return res.status(400).send('All Inputs Must Be Filled.');
        }

        foundWord.meaning = req.body.meaning;

        foundWord.save()
        .then(() => {
            return res.redirect(`/words/single-word/${req.params.wordId}`);
        });
    })
    .catch((err) => {
        return res.status(500).json({ message: 'Server Error' });
    });
});

router.get('/update-word/:wordId', (req, res) => {
    Word.findById(req.params.wordId)
    .then((foundWord) => {
        if(!foundWord) {
            return res.status(400).send('Word Not Found.');
        }

        return res.status(200).render('main/update-word', { foundWord: foundWord });
    })
    .catch((err) => {
        return res.status(500).json({ message: 'Server Error' });
    });
});

router.delete('/delete-word/:wordId', (req, res) => {
    Word.findByIdAndDelete(req.params.wordId)
    .then((foundWord) => {
        if(!foundWord) {
            return res.status(400).send('Word Not Found.');
        }

        return res.status(200).redirect('/words/get-words');
    }) 
    .catch((err) => {
        return res.status(500).json({message: 'Server Error'});
    })
});

module.exports = router;