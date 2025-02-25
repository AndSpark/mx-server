import { Test } from '@nestjs/testing'
import { getModelToken } from '~/transformers/model.transformer'
import { CategoryModel } from '~/modules/category/category.model'
import { MarkdownService } from '~/modules/markdown/markdown.service'
import { NoteModel } from '~/modules/note/note.model'
import { PageModel } from '~/modules/page/page.model'
import { PostModel } from '~/modules/post/post.model'
import { DatabaseService } from '~/processors/database/database.service'
import { AssetService } from '~/processors/helper/helper.asset.service'
describe('test Markdown Service', () => {
  let service: MarkdownService

  beforeAll(async () => {
    const ref = await Test.createTestingModule({
      providers: [
        MarkdownService,
        {
          provide: getModelToken(CategoryModel.name),
          useValue: jest.fn(),
        },
        {
          provide: getModelToken(PostModel.name),
          useValue: jest.fn(),
        },
        {
          provide: getModelToken(NoteModel.name),
          useValue: jest.fn(),
        },
        {
          provide: getModelToken(PageModel.name),
          useValue: jest.fn(),
        },
        {
          provide: AssetService,
          useValue: jest.fn(),
        },
        {
          provide: DatabaseService,
          useValue: jest.fn(),
        },
      ],
    }).compile()

    service = ref.get(MarkdownService)
  })

  it('should render markdown to html', async () => {
    const html = service.renderMarkdownContent('# title')
    expect(html).toBe('<h1 id="title">title</h1>\n')
  })
})
