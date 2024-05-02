import OpenAI from 'openai'

const form = document.getElementById('form')
const originalTextElement = document.getElementById('originalText')
const translationElement = document.getElementById('translation')
const startOverButton = document.getElementById('startOver')

startOverButton.addEventListener('click', () => {
  form.style.display = 'block'
  translationElement.style.display = 'none'
  form.reset()
  originalTextElement.value = ''
  translationElement.value = ''
})

const craftMessage = (text, selectedLanguage) => {
  const messages = [
    {
      role: 'system',
      content:
        'You are a translator who is fluent in English, French, Spanish and Japanese.  I am going to give you some text in English, and I would like you to translate it to either French, Spanish or Japanese. I will indicate which of those three languages you should translate to.',
    },
    {
      role: 'user',
      content: `Please translate the following text to ${selectedLanguage}: ${text}.`,
    },
  ]

  return messages
}

form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const text = document.getElementById('text').value
  const selectedLanguage = document.querySelector(
    'input[name="language"]:checked'
  ).value
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  })
  const messages = craftMessage(text, selectedLanguage)
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages,
      temperature: 1,
      max_tokens: 100,
    })

    renderTranslation(response.choices[0].message.content, text)
  } catch (error) {
    console.error('error', error)
    // UI => error message
  }
})

function renderTranslation(response, originalText) {
  form.style.display = 'none'
  translationElement.style.display = 'block'

  originalTextElement.value = originalText
  translationElement.value = response
}
// Please translate the text to the specified language and then translate it back to English.  I will then ask you to provide the translated text back to me.  Are you ready to begin?
