/**
 * 增强型类名转换工具
 * 按功能模块分类管理CSS规则，提高可维护性
 * 修复：flex-col/flex-row的宽高被h-100/w-100覆盖的问题（通过规则类型优先级排序实现）
 */
class ClassTransformer {
  // 规则类型枚举（数字越小，应用优先级越低；确保尺寸类后执行以覆盖布局类）
  static #RULE_TYPE = Object.freeze({
    LAYOUT: 1,    // 布局类（flex-col/flex-row等，先执行）
    DIMENSION: 2, // 尺寸类（h-100/w-100等，后执行，覆盖布局类）
    OTHER: 3      // 其他类（文本、边框等，最后执行）
  });

  // 静态私有缓存（存储已处理的类名）
  static #processedCache = new WeakMap();
  
  // 私有静态默认规则配置
  static #DEFAULT_RULE = Object.freeze({
    unit: 'px',
    multiplier: 1,
    isKeyword: false,
    pattern: null,
    cssProperty: null,
    styles: null,
    additionalStyles: null,
    ruleType: null // 规则类型字段，默认null
  });

  // 规则缓存（按匹配类型分组）
  #keywordRules = new Map();       // 关键字规则: 类名 → 规则
  #patternRules = [];              // 正则规则: [{ pattern, rule, key }, ...]
  #prefixRules = new Map();        // 前缀规则: 前缀 → 规则
  #longestPrefixLen = 0;           // 最长前缀长度

  constructor() {
    this.#initRules();
    if (document.readyState === 'complete') {
      this.#processExistingElements();
    } else {
      window.addEventListener('load', () => this.#processExistingElements());
    }
    this.#observeDOMChanges();
  }

  /**
   * 初始化规则（按功能模块组织，新增规则类型标记）
   */
  #initRules() {
    // 按功能分类的规则集合
    const functionalRules = {
      // 1. 尺寸与布局（宽高、边距、定位）
      dimension: {
        // 宽度（尺寸类：DIMENSION）
        'w-': { 
          cssProperty: 'width', 
          unit: 'px', 
          pattern: /^w-(\d+)$/, 
          additionalStyles: { flexShrink: '0' },
          ruleType: ClassTransformer.#RULE_TYPE.DIMENSION 
        },
        'w': { 
          cssProperty: 'width', 
          unit: '%', 
          pattern: /^w(\d+)$/,
          ruleType: ClassTransformer.#RULE_TYPE.DIMENSION 
        },
        'mw-': { 
          cssProperty: 'minWidth', 
          unit: 'px', 
          pattern: /^ww-(\d+)$/, 
          additionalStyles: { flexShrink: '0' },
          ruleType: ClassTransformer.#RULE_TYPE.DIMENSION 
        },
        'w-calc': { 
          cssProperty: 'width', 
          pattern: /^w-calc\(([^)]+)\)$/,
          additionalStyles: { flexShrink: '0' },
          ruleType: ClassTransformer.#RULE_TYPE.DIMENSION 
        },
        
        // 高度（尺寸类：DIMENSION）
        'h-': { 
          cssProperty: 'height', 
          unit: 'px', 
          pattern: /^h-(\d+)$/, 
          additionalStyles: { flexShrink: '0' },
          ruleType: ClassTransformer.#RULE_TYPE.DIMENSION 
        },
        'h': { 
          cssProperty: 'height', 
          unit: '%', 
          pattern: /^h(\d+)$/,
          ruleType: ClassTransformer.#RULE_TYPE.DIMENSION 
        },
        'mh-': { 
          cssProperty: 'minHeight', 
          unit: 'px', 
          pattern: /^mh-(\d+)$/, 
          additionalStyles: { flexShrink: '0' },
          ruleType: ClassTransformer.#RULE_TYPE.DIMENSION 
        },
        'h-calc': { 
          cssProperty: 'height', 
          pattern: /^h-calc\(([^)]+)\)$/,
          additionalStyles: { flexShrink: '0' },
          ruleType: ClassTransformer.#RULE_TYPE.DIMENSION 
        },
        
        // 外边距（其他类：OTHER）
        'm-': { cssProperty: 'margin', ruleType: ClassTransformer.#RULE_TYPE.OTHER },
        'mr-': { cssProperty: 'marginRight', ruleType: ClassTransformer.#RULE_TYPE.OTHER },
        'ml-': { cssProperty: 'marginLeft', ruleType: ClassTransformer.#RULE_TYPE.OTHER },
        'mt-': { cssProperty: 'marginTop', ruleType: ClassTransformer.#RULE_TYPE.OTHER },
        'mb-': { cssProperty: 'marginBottom', ruleType: ClassTransformer.#RULE_TYPE.OTHER },
        
        // 内边距（其他类：OTHER）
        'p-': { cssProperty: 'padding', ruleType: ClassTransformer.#RULE_TYPE.OTHER },
        'pt-': { cssProperty: 'paddingTop', ruleType: ClassTransformer.#RULE_TYPE.OTHER },
        'pb-': { cssProperty: 'paddingBottom', ruleType: ClassTransformer.#RULE_TYPE.OTHER },
        'pl-': { cssProperty: 'paddingLeft', ruleType: ClassTransformer.#RULE_TYPE.OTHER },
        'pr-': { cssProperty: 'paddingRight', ruleType: ClassTransformer.#RULE_TYPE.OTHER },
        
        // 定位（其他类：OTHER）
        'relative': { 
          isKeyword: true, 
          styles: { position: 'relative' },
          ruleType: ClassTransformer.#RULE_TYPE.OTHER 
        },
        'absolute': { 
          isKeyword: true, 
          styles: { position: 'absolute' },
          ruleType: ClassTransformer.#RULE_TYPE.OTHER 
        },
        'fixed': { 
          isKeyword: true, 
          styles: { position: 'fixed' },
          ruleType: ClassTransformer.#RULE_TYPE.OTHER 
        },
        'sticky': { 
          isKeyword: true, 
          styles: { position: 'sticky' },
          ruleType: ClassTransformer.#RULE_TYPE.OTHER 
        },
        'cursor-pointer': { 
          isKeyword: true, 
          styles: { cursor: 'pointer' },
          ruleType: ClassTransformer.#RULE_TYPE.OTHER 
        },
      },

      // 2. 文本样式（字体、对齐、省略）
      text: {
        'fs-': { 
          cssProperty: 'fontSize', 
          unit: 'px', 
          pattern: /^fs-(\d+)$/,
          ruleType: ClassTransformer.#RULE_TYPE.OTHER 
        },
        'lh-': { 
          cssProperty: 'lineHeight', 
          unit: 'px', 
          pattern: /^lh-(\d+)$/,
          ruleType: ClassTransformer.#RULE_TYPE.OTHER 
        },
        'center': { 
          isKeyword: true, 
          styles: { textAlign: 'center' },
          ruleType: ClassTransformer.#RULE_TYPE.OTHER 
        },
        'left': { 
          isKeyword: true, 
          styles: { textAlign: 'left' },
          ruleType: ClassTransformer.#RULE_TYPE.OTHER 
        },
        'right': { 
          isKeyword: true, 
          styles: { textAlign: 'right' },
          ruleType: ClassTransformer.#RULE_TYPE.OTHER 
        },
        // 新增：文本颜色规则
        'color-': {
          cssProperty: 'color',
          pattern: /^color-\[([^\]]+)\]$/, // 匹配 color-[xxx] 格式
          ruleType: ClassTransformer.#RULE_TYPE.OTHER
        },
        'weight': { 
          isKeyword: true, 
          styles: { fontWeight: 'bolder' },
          ruleType: ClassTransformer.#RULE_TYPE.OTHER 
        },
        'singleline': { 
          isKeyword: true, 
          styles: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          },
          ruleType: ClassTransformer.#RULE_TYPE.OTHER 
        }
      },

      // 3. Flex布局（布局类：LAYOUT）
      flex: {
        'flex-1': { 
          isKeyword: true, 
          styles: { flex: 1 },
          ruleType: ClassTransformer.#RULE_TYPE.LAYOUT 
        },
        'flex-2': { 
          isKeyword: true, 
          styles: { flex: 2 },
          ruleType: ClassTransformer.#RULE_TYPE.LAYOUT 
        },
        'flex-row': { 
          isKeyword: true, 
          styles: { 
            display: 'flex', 
            flexDirection: 'row', 
            height: '100%'  // 默认高100%
          },
          ruleType: ClassTransformer.#RULE_TYPE.LAYOUT 
        },
        'flex-col': { 
          isKeyword: true, 
          styles: { 
            display: 'flex', 
            flexDirection: 'column', 
            width: '100%',  // 默认宽100%
          },
          ruleType: ClassTransformer.#RULE_TYPE.LAYOUT 
        },
        'flex-wrap': { 
          isKeyword: true, 
          styles: { flexWrap: 'wrap' },
          ruleType: ClassTransformer.#RULE_TYPE.LAYOUT 
        },
        'justify-center': { 
          isKeyword: true, 
          styles: { justifyContent: 'center' },
          ruleType: ClassTransformer.#RULE_TYPE.LAYOUT 
        },
        'items-center': { 
          isKeyword: true, 
          styles: { alignItems: 'center' },
          ruleType: ClassTransformer.#RULE_TYPE.LAYOUT 
        },
        'justify-between': { 
          isKeyword: true, 
          styles: { justifyContent: 'space-between' },
          ruleType: ClassTransformer.#RULE_TYPE.LAYOUT 
        }
      },

      // 4. 边框与圆角
      border: {
        'border': { 
          isKeyword: true, 
          styles: { border: '1px solid red' },
          ruleType: ClassTransformer.#RULE_TYPE.OTHER 
        },
        'br-': { 
          cssProperty: 'borderRadius', 
          unit: 'px', 
          pattern: /^br-(\d+)$/,
          ruleType: ClassTransformer.#RULE_TYPE.OTHER 
        },
        'br': { 
          cssProperty: 'borderRadius', 
          unit: '%', 
          pattern: /^br(\d+)$/,
          ruleType: ClassTransformer.#RULE_TYPE.OTHER 
        },
        // 新增：支持 border-[color] 语法
        'border-': { 
            cssProperty: 'border', 
            pattern: /^border-\[([^\]]+)\]$/, // 匹配 border-[xxx]
            ruleType: ClassTransformer.#RULE_TYPE.OTHER 
        }
      },

      // 5. 溢出处理
      overflow: {
        'overlay': { 
          isKeyword: true, 
          styles: { overflow: 'overlay' },
          ruleType: ClassTransformer.#RULE_TYPE.OTHER 
        },
        'hidden': { 
          isKeyword: true, 
          styles: { overflow: 'hidden' },
          ruleType: ClassTransformer.#RULE_TYPE.OTHER 
        }
      },
      // 6. 新增：背景样式模块
      background: {
        'bg-': {
          cssProperty: 'backgroundColor',
          pattern: /^bg-\[([^\]]+)\]$/, // 匹配 bg-[xxx] 格式
          ruleType: ClassTransformer.#RULE_TYPE.OTHER
        }
      }
    };

    // 扁平化所有规则并分类存储
    Object.values(functionalRules).forEach(moduleRules => {
      Object.entries(moduleRules).forEach(([key, config]) => {
        const rule = { ...ClassTransformer.#DEFAULT_RULE, ...config };
        
        if (rule.isKeyword) {
          this.#keywordRules.set(key, rule);
        } else if (rule.pattern) {
          this.#patternRules.push({ pattern: rule.pattern, rule, key });
        } else if (key) {
          this.#prefixRules.set(key, rule);
          this.#longestPrefixLen = Math.max(this.#longestPrefixLen, key.length);
        }
      });
    });
  }

  /**
   * 处理现有元素
   */
  #processExistingElements() {
    const elements = document.body.querySelectorAll('*');
    this.#batchProcess(elements, 200);
  }

  /**
   * 分批次处理元素（避免阻塞主线程）
   */
  #batchProcess(elements, batchSize) {
    let index = 0;
    const processBatch = () => {
      const end = Math.min(index + batchSize, elements.length);
      for (; index < end; index++) {
        this.#processElement(elements[index]);
      }
      if (index < elements.length) {
        requestAnimationFrame(processBatch);
      }
    };
    processBatch();
  }

  /**
   * 监听DOM变化（新增/删除元素、类名修改）
   */
  #observeDOMChanges() {
    const observer = new MutationObserver(mutations => {
      const elementsToProcess = new Set();
      
      mutations.forEach(mutation => {
        // 处理新增元素
        if (mutation.addedNodes.length) {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              elementsToProcess.add(node);
              node.querySelectorAll('*').forEach(child => elementsToProcess.add(child));
            }
          });
        }
        
        // 处理类名修改
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          elementsToProcess.add(mutation.target);
        }
      });
      
      if (elementsToProcess.size) {
        requestAnimationFrame(() => {
          elementsToProcess.forEach(el => this.#processElement(el));
        });
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class']
    });
  }

  /**
   * 处理单个元素（核心修改：按规则类型排序后应用样式）
   */
  #processElement(element) {
    if (!element.classList || !element.classList.length) return;
    
    // 初始化元素的已处理类名缓存
    if (!ClassTransformer.#processedCache.has(element)) {
      ClassTransformer.#processedCache.set(element, new Set());
    }
    const processed = ClassTransformer.#processedCache.get(element);
    const currentClasses = Array.from(element.classList); // 转为数组便于处理

    let hasChanges = false;

    // 步骤1：给每个类名匹配对应的规则类型
    const classWithType = currentClasses.map(className => {
      let ruleType = ClassTransformer.#RULE_TYPE.OTHER; // 默认类型

      // 匹配关键字规则的类型
      if (this.#keywordRules.has(className)) {
        ruleType = this.#keywordRules.get(className).ruleType || ruleType;
      }
      // 匹配正则规则的类型
      else {
        const matchedPatternRule = this.#patternRules.find(item => item.pattern.test(className));
        if (matchedPatternRule) {
          ruleType = matchedPatternRule.rule.ruleType || ruleType;
        }
        // 匹配前缀规则的类型
        else {
          const maxCheckLen = Math.min(className.length, this.#longestPrefixLen);
          for (let len = maxCheckLen; len > 0; len--) {
            const prefix = className.substring(0, len);
            if (this.#prefixRules.has(prefix)) {
              ruleType = this.#prefixRules.get(prefix).ruleType || ruleType;
              break;
            }
          }
        }
      }

      return { className, ruleType };
    });

    // 步骤2：按规则类型排序（LAYOUT→DIMENSION→OTHER），确保尺寸类后执行
    const sortedClasses = classWithType.sort((a, b) => a.ruleType - b.ruleType);

    // 步骤3：应用排序后的类名样式
    sortedClasses.forEach(({ className }) => {
      if (!processed.has(className)) {
        this.#matchAndApplyRule(element, className);
        processed.add(className);
        hasChanges = true;
      }
    });

    // 步骤4：清理已从元素中移除的类名缓存
    if (hasChanges) {
      processed.forEach(className => {
        if (!currentClasses.includes(className)) {
          processed.delete(className);
        }
      });
    }
  }

  /**
   * 匹配并应用规则
   */
  #matchAndApplyRule(element, className) {
    // 1. 关键字匹配
    const keywordRule = this.#keywordRules.get(className);
    if (keywordRule) {
      this.#applyStyles(element.style, keywordRule.styles);
      return;
    }
    
    // 2. 正则匹配（处理calc等特殊规则）
    for (const { pattern, rule } of this.#patternRules) {
      const match = pattern.exec(className);
      if (match && match[1] !== undefined) {
        // 处理calc计算属性
        if (rule.cssProperty && rule.pattern.toString().includes('calc')) {
          element.style[rule.cssProperty] = `calc(${match[1]})`;
        } 
        // 处理颜色属性（bg-[xxx]、color-[xxx]）
        else if (['backgroundColor', 'color'].includes(rule.cssProperty)) {
          element.style[rule.cssProperty] = match[1];
        } 
        // 处理边框属性（border-[xxx]），强制设置为 1px solid + 颜色
        else if (rule.cssProperty === 'border') {
            element.style[rule.cssProperty] = `1px solid ${match[1]}`;
        }
        else {
          // 普通数值规则
          this.#applyValueStyle(element.style, rule, match[1]);
        }
        
        // 应用额外样式
        if (rule.additionalStyles) {
          this.#applyStyles(element.style, rule.additionalStyles);
        }
        return;
      }
    }
    
    // 3. 前缀匹配
    const maxCheckLen = Math.min(className.length, this.#longestPrefixLen);
    for (let len = maxCheckLen; len > 0; len--) {
      const prefix = className.substring(0, len);
      const rule = this.#prefixRules.get(prefix);
      if (rule) {
        const valueStr = className.substring(len);
        const value = parseInt(valueStr, 10);
        if (!isNaN(value)) {
          this.#applyValueStyle(element.style, rule, value);
          return;
        }
      }
    }
  }

  /**
   * 应用基于数值的样式
   */
  #applyValueStyle(style, rule, value) {
    if (isNaN(value)) return;
    
    const finalValue = parseInt(value, 10) * rule.multiplier;
    style[rule.cssProperty] = `${finalValue}${rule.unit}`;
  }

  /**
   * 批量应用样式
   */
  #applyStyles(style, styles) {
    for (const [prop, val] of Object.entries(styles)) {
      style[prop] = val;
    }
  }

  /**
   * 按功能模块添加新规则
   * @param {string} module - 功能模块（如'dimension', 'text'）
   * @param {string} key - 规则标识
   * @param {Object} config - 规则配置
   */
  addRule(module, key, config) {
    const rule = { ...ClassTransformer.#DEFAULT_RULE, ...config };
    if (rule.isKeyword) {
      this.#keywordRules.set(key, rule);
    } else if (rule.pattern) {
      this.#patternRules.push({ pattern: rule.pattern, rule, key });
    } else if (key) {
      this.#prefixRules.set(key, rule);
      this.#longestPrefixLen = Math.max(this.#longestPrefixLen, key.length);
    }
  }

  /**
   * 移除规则
   */
  removeRule(key) {
    this.#keywordRules.delete(key);
    this.#prefixRules.delete(key);
    this.#patternRules = this.#patternRules.filter(item => item.key !== key);
    if (!this.#prefixRules.has(key)) {
      this.#longestPrefixLen = Array.from(this.#prefixRules.keys())
        .reduce((max, k) => Math.max(max, k.length), 0);
    }
  }
}

// 初始化工具
window.addEventListener('DOMContentLoaded', () => {
  new ClassTransformer();
});